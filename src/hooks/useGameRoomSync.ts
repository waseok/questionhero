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

/**
 * 온라인 방일 때만 Supabase `rooms` 행과 실시간 동기화합니다.
 * 로컬 연습(`kind === 'local'`) 또는 포털에서는 아무 것도 하지 않습니다.
 *
 * Presence와 postgres_changes를 **서로 다른 채널**로 분리합니다.
 * 한 채널에 둘을 같이 두면, `rooms` 테이블에 Realtime이 안 붙었거나
 * 서버 필터 검증에 실패할 때 전체 구독이 실패해 `track()`이 호출되지 않고
 * 접속자 수가 영원히 0으로 남는 문제가 생길 수 있습니다.
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

    /** 접속자 표시만 담당 (postgres와 독립적으로 SUBSCRIBED 보장) */
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

    /** 게임 상태 DB 변경 구독만 담당 */
    const dataChannel = supabase.channel(`room_data_${roomCode}`);
    const applyRemote = (snap: GameSnapshot) => {
      const json = JSON.stringify(snap);
      if (json === lastRemoteJsonRef.current) return;
      lastRemoteJsonRef.current = json;
      skipPushRef.current = true;
      useGameStore.getState().applyRemoteSnapshot(snap);
      skipPushRef.current = false;
      /** 원격이 setup 플레이어 이름을 덮은 직후, 현재 Presence 순서로 다시 맞춤 */
      if (snap.step === "setup") {
        queueMicrotask(() => syncPresenceUsers());
      }
    };

    const loadInitial = async () => {
      const { data, error } = await supabase.from("rooms").select("game_state").eq("code", roomCode).maybeSingle();
      if (cancelled) return;
      if (error || !data?.game_state) return;
      applyRemote(data.game_state as GameSnapshot);
      /** 이전 400ms 지연은 방장이 곧바로「게임 시작」을 누를 때 푸시가 막혀 참가자 화면이 안 바뀌는 원인이 됨 */
      queueMicrotask(() => {
        if (!cancelled) pushEnabledRef.current = true;
      });
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
    };
  }, [roomCode, kind]);
}
