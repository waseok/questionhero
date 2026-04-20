import { useEffect, useRef } from "react";
import { buildGameSnapshotFromStoreState } from "../lib/gameSnapshot";
import { applyJoinOrderToSetupPlayers, sortConnectedByJoinOrder } from "../lib/onlineSeatOrder";
import { getSupabase } from "../lib/supabaseClient";
import { useGameStore } from "../store/gameStore";
import type { RoomConnectionKind } from "../store/roomStore";
import { useRoomStore } from "../store/roomStore";
import type { GameSnapshot } from "../types/game";

type StoreSlice = GameSnapshot & Record<string, unknown>;

const isSubscribed = (status: string) => status === "SUBSCRIBED";

/** postgres_changes와 별도로, 같은 방 클라이언트에게 즉시 스냅샷을 뿌립니다(기본 self=false → 송신자 제외). */
const GAME_BROADCAST_EVENT = "qh_game";

function readSnapFromBroadcastMessage(msg: unknown): GameSnapshot | null {
  if (typeof msg !== "object" || msg === null) return null;
  const m = msg as Record<string, unknown>;
  const p = m.payload;
  if (p && typeof p === "object") {
    const snap = (p as Record<string, unknown>).snap;
    if (snap && typeof snap === "object") return snap as GameSnapshot;
  }
  const direct = m.snap;
  if (direct && typeof direct === "object") return direct as GameSnapshot;
  return null;
}

/**
 * 온라인 방일 때만 Supabase `rooms` 행과 실시간 동기화합니다.
 *
 * - Presence: 접속자 목록
 * - postgres_changes: DB 영속화 및 백업 동기화
 * - **Broadcast**: DB 복제/필터 이슈와 무관하게 같은 방 전원에게 즉시 `game_state` 전달 (동시 진행 핵심)
 */
export function useGameRoomSync(roomCode: string | null, kind: RoomConnectionKind) {
  const pushTimerRef = useRef(0);
  const skipPushRef = useRef(false);
  const pushEnabledRef = useRef(false);
  const lastRemoteJsonRef = useRef("");

  useEffect(() => {
    if (kind !== "online" || !roomCode) return;
    const supabase = getSupabase();
    if (!supabase) return;

    pushEnabledRef.current = false;
    lastRemoteJsonRef.current = "";

    let cancelled = false;
    const roomStore = useRoomStore.getState();
    const clientId = roomStore.myClientId;

    const presenceChannel = supabase.channel(`room_presence_${roomCode}`, {
      config: {
        presence: {
          key: clientId,
        },
      },
    });

    const syncPresenceUsers = () => {
      const state = presenceChannel.presenceState<{ name?: string; clientId?: string; onlineAt?: string }>();
      const rows = Object.values(state)
        .flat()
        .map((p) => ({
          clientId: (p.clientId ?? "?").trim() || "?",
          name: (p.name ?? "").trim(),
          onlineAt: typeof p.onlineAt === "string" && p.onlineAt.length > 0 ? p.onlineAt : "2999-12-31T23:59:59.999Z",
        }))
        .filter((u) => u.name.length > 0);
      const sorted = sortConnectedByJoinOrder(rows);
      useRoomStore.getState().setConnectedUsers(sorted);
      applyJoinOrderToSetupPlayers(sorted);
    };

    presenceChannel
      .on("presence", { event: "sync" }, syncPresenceUsers)
      .on("presence", { event: "join" }, syncPresenceUsers)
      .on("presence", { event: "leave" }, syncPresenceUsers);

    void presenceChannel.subscribe(async (status) => {
      if (!isSubscribed(status)) return;
      const rs = useRoomStore.getState();
      await presenceChannel.track({
        name: rs.myName.trim() || "이름없음",
        clientId: rs.myClientId,
        onlineAt: new Date().toISOString(),
      });
      syncPresenceUsers();
    });

    const dataChannel = supabase.channel(`room_data_${roomCode}`);

    const applyRemote = (snap: GameSnapshot) => {
      const json = JSON.stringify(snap);
      if (json === lastRemoteJsonRef.current) return;

      // 투표 단계에서 내가 입력 중인 답변이 원격 스냅샷에 덮어씌워지는 것을 방지
      let mergedSnap = snap;
      if (snap.step === "voting") {
        const { myClientId, connectedUsers } = useRoomStore.getState();
        const myIndex = connectedUsers.findIndex((u) => u.clientId === myClientId);
        if (myIndex >= 0) {
          const myPlayerId = `p${myIndex + 1}`;
          const localAnswer = useGameStore.getState().questionPicks.find((p) => p.playerId === myPlayerId)?.answer ?? "";
          if (localAnswer) {
            mergedSnap = {
              ...snap,
              questionPicks: snap.questionPicks.map((pick) =>
                pick.playerId === myPlayerId ? { ...pick, answer: localAnswer } : pick,
              ),
            };
          }
        }
      }

      lastRemoteJsonRef.current = JSON.stringify(mergedSnap);
      skipPushRef.current = true;
      useGameStore.getState().applyRemoteSnapshot(mergedSnap);
      skipPushRef.current = false;
    };

    const gameBroadcastChannel = supabase.channel(`room_game_${roomCode}`);
    gameBroadcastChannel.on("broadcast", { event: GAME_BROADCAST_EVENT }, (msg: unknown) => {
      const snap = readSnapFromBroadcastMessage(msg);
      if (snap) applyRemote(snap);
    });
    void gameBroadcastChannel.subscribe();

    const loadInitial = async () => {
      const { data, error } = await supabase.from("rooms").select("game_state").eq("code", roomCode).maybeSingle();
      if (cancelled) return;
      if (!error && data?.game_state) {
        applyRemote(data.game_state as GameSnapshot);
      }
      if (!cancelled) {
        pushEnabledRef.current = true;
        // presence 구독과 loadInitial 사이의 race condition 해소:
        // DB 스냅샷 적용 후 현재 presence 상태를 덮어씌워 이름이 기본값으로 리셋되는 것을 방지
        syncPresenceUsers();
      }
    };

    void loadInitial();

    dataChannel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "rooms", filter: `code=eq.${roomCode}` },
      (payload) => {
        const row = payload.new as { game_state?: GameSnapshot };
        if (row?.game_state) applyRemote(row.game_state);
      },
    );

    void dataChannel.subscribe();

    const unsub = useGameStore.subscribe((state) => {
      if (!pushEnabledRef.current || skipPushRef.current) return;
      const snap = buildGameSnapshotFromStoreState(state as unknown as StoreSlice);
      window.clearTimeout(pushTimerRef.current);
      pushTimerRef.current = window.setTimeout(async () => {
        if (skipPushRef.current) return;
        /** Broadcast를 먼저 보내 참가자 화면이 DB 라운드트립을 기다리지 않게 함 */
        try {
          await gameBroadcastChannel.send({
            type: "broadcast",
            event: GAME_BROADCAST_EVENT,
            payload: { snap },
          });
        } catch {
          /* 전송 실패 시에도 DB 갱신은 시도 */
        }
        await supabase.from("rooms").update({ game_state: snap, updated_at: new Date().toISOString() }).eq("code", roomCode);
      }, 200);
    });

    return () => {
      cancelled = true;
      pushEnabledRef.current = false;
      window.clearTimeout(pushTimerRef.current);
      useRoomStore.getState().setConnectedUsers([]);
      unsub();
      void supabase.removeChannel(presenceChannel);
      void supabase.removeChannel(dataChannel);
      void supabase.removeChannel(gameBroadcastChannel);
    };
  }, [roomCode, kind]);
}
