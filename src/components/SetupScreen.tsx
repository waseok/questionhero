import { PlayerToken } from "./PlayerToken";
import { useGameStore } from "../store/gameStore";
import { useRoomStore } from "../store/roomStore";

export function SetupScreen() {
  const kind = useRoomStore((s) => s.kind);
  const roomCode = useRoomStore((s) => s.roomCode);
  const players = useGameStore((s) => s.players);
  const gameMode = useGameStore((s) => s.gameMode);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setMode = useGameStore((s) => s.setMode);
  const startGame = useGameStore((s) => s.startGame);
  const canStart = players.every((p) => p.name.trim().length > 0);

  return (
    <section className="game-card space-y-6 p-6 md:p-8">
      <div>
        <h2 className="game-title text-3xl text-[var(--game-ink)] md:text-4xl">나를 구해줘!</h2>
        <p className="mt-2 text-sm font-medium text-[var(--game-ink-soft)]">SAFE 스타일 · 질문 히어로 보드</p>
        {kind === "online" && roomCode ? (
          <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-2 text-sm font-semibold text-blue-950">
            같은 방에서 진행 중입니다. 방 코드 <span className="tabular-nums">{roomCode}</span>를 다른 기기에 입력하면 함께할 수 있어요.
          </p>
        ) : null}
        {kind === "local" ? (
          <p className="mt-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700">이 기기에서만 진행하는 연습 모드입니다.</p>
        ) : null}
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-[var(--game-wood)]">플레이어 말 올리기</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border-2 border-[var(--game-wood)]/15 bg-white/45 p-3 shadow-inner">
              <PlayerToken playerId={p.id} name={p.name} />
              <label className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wide text-[var(--game-ink-soft)]">
                {p.id}
                <input
                  className="mt-1.5 w-full rounded-lg border-2 border-[var(--game-wood)]/25 bg-white/90 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-[var(--game-ink)] outline-none ring-amber-400/30 focus:border-amber-500/60 focus:ring-2"
                  value={p.name}
                  placeholder="이름 입력"
                  onChange={(e) => setPlayerName(p.id, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-[var(--game-wood)]">게임 모드</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-xl border-2 px-4 py-2.5 text-sm font-extrabold transition ${
              gameMode === "thoughtful"
                ? "border-blue-900/50 bg-gradient-to-b from-sky-400 to-blue-700 text-white shadow-[0_4px_0_#1e3a5f]"
                : "border-transparent bg-black/[0.06] text-[var(--game-ink-soft)] hover:bg-black/[0.09]"
            }`}
            onClick={() => setMode("thoughtful")}
          >
            신중한 판단
          </button>
          <button
            type="button"
            className={`rounded-xl border-2 px-4 py-2.5 text-sm font-extrabold transition ${
              gameMode === "emergency"
                ? "border-red-900/60 bg-gradient-to-b from-rose-500 to-red-700 text-white shadow-[0_4px_0_#7f1d1d]"
                : "border-transparent bg-black/[0.06] text-[var(--game-ink-soft)] hover:bg-black/[0.09]"
            }`}
            onClick={() => setMode("emergency")}
          >
            긴급 대응
          </button>
        </div>
      </div>

      <button type="button" className="game-btn-cta text-base" disabled={!canStart} onClick={startGame}>
        게임 시작
      </button>
    </section>
  );
}
