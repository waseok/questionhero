import { useState } from "react";
import { buildGameSnapshotFromStoreState } from "../lib/gameSnapshot";
import { randomRoomCode } from "../lib/roomCode";
import { getSupabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { useGameStore } from "../store/gameStore";
import { useRoomStore } from "../store/roomStore";
import type { GameSnapshot } from "../types/game";

type StoreSlice = GameSnapshot & Record<string, unknown>;

/**
 * 첫 화면: 흰 배경 + 큰 로고 + 게임 만들기 / 함께하기 / 오프라인 연습
 */
export function OnlinePortal() {
  const [joinInput, setJoinInput] = useState("");
  const [busy, setBusy] = useState(false);
  const enterLocalPractice = useRoomStore((s) => s.enterLocalPractice);
  const enterOnlineRoom = useRoomStore((s) => s.enterOnlineRoom);
  const setRoomError = useRoomStore((s) => s.setRoomError);
  const roomError = useRoomStore((s) => s.roomError);

  const handleCreateOnline = async () => {
    setRoomError(null);
    if (!isSupabaseConfigured) {
      setRoomError("Supabase 환경 변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)를 설정한 뒤 다시 시도해 주세요.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    setBusy(true);
    useGameStore.getState().resetGame();
    const snapshot = buildGameSnapshotFromStoreState(useGameStore.getState() as unknown as StoreSlice);

    for (let attempt = 0; attempt < 20; attempt++) {
      const code = randomRoomCode();
      const { error } = await supabase.from("rooms").insert({ code, game_state: snapshot });
      if (!error) {
        enterOnlineRoom(code, true);
        setBusy(false);
        return;
      }
    }
    setRoomError("방 코드를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    setBusy(false);
  };

  const handleJoinOnline = async () => {
    setRoomError(null);
    if (!isSupabaseConfigured) {
      setRoomError("Supabase 환경 변수를 먼저 설정해 주세요.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    const code = joinInput.replace(/\D/g, "");
    if (!/^\d{4}$/.test(code)) {
      setRoomError("숫자 4자리를 모두 입력해 주세요.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.from("rooms").select("game_state").eq("code", code).maybeSingle();
    if (error || !data?.game_state) {
      setRoomError("해당 코드의 방을 찾을 수 없습니다.");
      setBusy(false);
      return;
    }
    try {
      useGameStore.getState().applyRemoteSnapshot(data.game_state as GameSnapshot);
    } catch {
      setRoomError("방 데이터를 읽는 데 실패했습니다.");
      setBusy(false);
      return;
    }
    enterOnlineRoom(code, false);
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-white text-[var(--game-ink)]">
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-10 md:py-14">
        <img
          src="/logo-question-hero.png"
          alt="질문 히어로"
          width={840}
          height={360}
          decoding="async"
          className="mx-auto w-[min(96vw,720px)] max-w-none select-none"
        />
        <p className="mt-4 text-center text-sm font-semibold text-[var(--game-ink-soft)]">온라인으로 모여 SAFE 질문 보드를 즐겨 보세요.</p>

        {!isSupabaseConfigured ? (
          <p className="mt-6 rounded-xl border-2 border-amber-500/40 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-950">
            Supabase URL·Anon 키가 없으면 온라인 방을 만들 수 없습니다. 프로젝트 루트에 `.env`를 만들고 `supabase/schema.sql`을 프로젝트에 적용한 뒤 Realtime을 켜 주세요.
          </p>
        ) : null}

        {roomError ? (
          <p className="mt-4 w-full rounded-xl border-2 border-rose-400/50 bg-rose-50 px-3 py-2 text-center text-sm font-semibold text-rose-900" role="alert">
            {roomError}
          </p>
        ) : null}

        <div className="mt-10 w-full space-y-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleCreateOnline()}
            className="w-full rounded-2xl border-2 border-blue-900/40 bg-gradient-to-b from-sky-500 to-blue-700 py-4 text-lg font-extrabold text-white shadow-[0_6px_0_#1e3a5f] transition enabled:hover:brightness-105 disabled:opacity-60"
          >
            게임 만들기
          </button>
          <p className="text-center text-xs font-medium text-[var(--game-ink-soft)]">4자리 방 코드가 생성되어 친구에게 공유할 수 있습니다.</p>

          <div className="rounded-2xl border-2 border-[var(--game-wood)]/25 bg-stone-50/90 p-4 shadow-inner">
            <p className="text-center text-sm font-bold text-[var(--game-wood)]">게임 함께하기</p>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-[var(--game-ink-soft)]">
              방 코드 (4자리)
              <input
                inputMode="numeric"
                maxLength={4}
                placeholder="예: 4821"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="mt-1.5 w-full rounded-xl border-2 border-[var(--game-wood)]/25 bg-white px-3 py-3 text-center text-2xl font-black tracking-[0.35em] text-[var(--game-ink)] outline-none ring-amber-400/30 focus:border-amber-500/50 focus:ring-2"
              />
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleJoinOnline()}
              className="game-btn-indigo mt-4 w-full py-3 text-base disabled:opacity-60"
            >
              입장하기
            </button>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setRoomError(null);
              useGameStore.getState().resetGame();
              enterLocalPractice();
            }}
            className="w-full rounded-2xl border-2 border-dashed border-[var(--game-wood)]/35 py-3 text-sm font-bold text-[var(--game-ink-soft)] transition hover:border-[var(--game-wood)]/55 hover:bg-stone-100/80"
          >
            오프라인으로 연습하기 (방 없이 이 기기만)
          </button>
        </div>
      </div>
    </div>
  );
}
