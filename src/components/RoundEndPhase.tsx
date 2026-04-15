import { PlayerToken } from "./PlayerToken";
import { TOTAL_GAME_ROUNDS, useGameStore } from "../store/gameStore";

export function RoundEndPhase() {
  const players = useGameStore((s) => s.players);
  const winner = useGameStore((s) => s.winnerPlayerId);
  const scores = useGameStore((s) => s.scores);
  const nextRound = useGameStore((s) => s.nextRound);
  const currentRound = useGameStore((s) => s.currentRound);
  const winnerName = players.find((p) => p.id === winner)?.name ?? "-";
  const showCoinEffect = Boolean(winner);

  return (
    <section className="game-card space-y-4 p-6 md:p-7">
      <h2 className="game-title text-2xl text-[var(--game-ink)]">라운드 {currentRound} 완료!</h2>
      <div className="relative overflow-hidden rounded-xl border-2 border-amber-600/30 bg-gradient-to-br from-amber-100 to-amber-200/90 p-4 font-bold text-amber-950 shadow-inner">
        <p>
          {winnerName} 님이 <span className="text-lg">⭐</span> 코인 1개 획득
        </p>
        {showCoinEffect && (
          <div className="pointer-events-none absolute inset-0">
            <span className="coin-pop left-[10%]">⭐</span>
            <span className="coin-pop left-[35%] [animation-delay:120ms]">✨</span>
            <span className="coin-pop left-[60%] [animation-delay:220ms]">⭐</span>
            <span className="coin-pop left-[82%] [animation-delay:320ms]">✨</span>
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {[...players]
          .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
          .map((p, i) => (
            <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl border-2 border-[var(--game-wood)]/12 bg-white/55 px-3 py-2.5 font-semibold text-[var(--game-ink)]">
              <span className="flex min-w-0 items-center gap-2">
                <PlayerToken playerId={p.id} name={p.name} />
                <span className="truncate">
                  {i + 1}위 {p.name}
                </span>
              </span>
              <span className="shrink-0 text-amber-700">⭐ {scores[p.id] ?? 0}</span>
            </li>
          ))}
      </ul>
      <button type="button" className="game-btn-indigo" onClick={nextRound}>
        다음 라운드 ({Math.min(currentRound + 1, TOTAL_GAME_ROUNDS)}/{TOTAL_GAME_ROUNDS})
      </button>
    </section>
  );
}
