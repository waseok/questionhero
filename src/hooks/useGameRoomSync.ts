import { useEffect, useRef } from "react";
import { buildGameSnapshotFromStoreState } from "../lib/gameSnapshot";
import { getSupabase } from "../lib/supabaseClient";
import { useGameStore } from "../store/gameStore";
import type { RoomConnectionKind } from "../store/roomStore";
import { useRoomStore } from "../store/roomStore";
import type { GameSnapshot } from "../types/game";

type StoreSlice = GameSnapshot & Record<string, unknown>;

/**
 * 온라인 방일 때만 Supabase `rooms` 행과 실시간 동기화합니다.
 * 로컬 연습(`kind === 'local'`) 또는 포털에서는 아무 것도 하지 않습니다.
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
    const channel = supabase.channel(`room_sync_${roomCode}`);
    const roomStore = useRoomStore.getState();

    const syncPresenceUsers = () => {
      const state = channel.presenceState<{ name?: string; clientId?: string }>();
      const flattened = Object.values(state)
        .flat()
        .map((p) => ({ clientId: p.clientId ?? "?", name: (p.name ?? "").trim() }))
        .filter((u) => u.name.length > 0);
      const uniqMap = new Map<string, { clientId: string; name: string }>();
      for (const u of flattened) uniqMap.set(`${u.clientId}:${u.name}`, u);
      roomStore.setConnectedUsers(Array.from(uniqMap.values()));
    };

    const applyRemote = (snap: GameSnapshot) => {
      const json = JSON.stringify(snap);
      if (json === lastRemoteJsonRef.current) return;
      lastRemoteJsonRef.current = json;
      skipPushRef.current = true;
      useGameStore.getState().applyRemoteSnapshot(snap);
      skipPushRef.current = false;
    };

    const loadInitial = async () => {
      const { data, error } = await supabase.from("rooms").select("game_state").eq("code", roomCode).maybeSingle();
      if (cancelled) return;
      if (error || !data?.game_state) return;
      applyRemote(data.game_state as GameSnapshot);
      window.setTimeout(() => {
        pushEnabledRef.current = true;
      }, 400);
    };

    void loadInitial();

    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "rooms", filter: `code=eq.${roomCode}` },
      (payload) => {
        const row = payload.new as { game_state?: GameSnapshot };
        if (row?.game_state) applyRemote(row.game_state);
      },
    );
    channel.on("presence", { event: "sync" }, syncPresenceUsers);
    channel.on("presence", { event: "join" }, syncPresenceUsers);
    channel.on("presence", { event: "leave" }, syncPresenceUsers);
    void channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          name: roomStore.myName || "이름없음",
          clientId: roomStore.myClientId,
          onlineAt: new Date().toISOString(),
        });
      }
    });

    const unsub = useGameStore.subscribe((state) => {
      if (!pushEnabledRef.current || skipPushRef.current) return;
      const snap = buildGameSnapshotFromStoreState(state as unknown as StoreSlice);
      window.clearTimeout(pushTimerRef.current);
      pushTimerRef.current = window.setTimeout(async () => {
        if (skipPushRef.current) return;
        await supabase.from("rooms").update({ game_state: snap, updated_at: new Date().toISOString() }).eq("code", roomCode);
      }, 380);
    });

    return () => {
      cancelled = true;
      pushEnabledRef.current = false;
      window.clearTimeout(pushTimerRef.current);
      roomStore.setConnectedUsers([]);
      unsub();
      void supabase.removeChannel(channel);
    };
  }, [roomCode, kind]);
}
