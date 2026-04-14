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
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">라운드 {currentRound} 완료!</h2>
      <div className="relative overflow-hidden rounded-lg bg-amber-50 p-3">
        <p>{winnerName} 님이 ⭐ 코인 1개 획득</p>
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
            <li key={p.id} className="rounded-lg bg-slate-50 p-2">
              {i + 1}등 {p.name} · ⭐ {scores[p.id] ?? 0}
            </li>
          ))}
      </ul>
      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={nextRound}>
        다음 라운드 ({Math.min(currentRound + 1, TOTAL_GAME_ROUNDS)}/{TOTAL_GAME_ROUNDS})
      </button>
    </section>
  );
}
