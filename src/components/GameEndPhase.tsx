import { PlayerToken } from "./PlayerToken";
import { useGameStore } from "../store/gameStore";

export function GameEndPhase() {
  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const resetGame = useGameStore((s) => s.resetGame);
  const sorted = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  return (
    <section className="game-card space-y-5 p-6 md:p-8">
      <h2 className="game-title text-3xl text-[var(--game-ink)]">게임 종료!</h2>
      <p className="-mt-2 text-sm font-semibold text-amber-800/90">최종 순위</p>
      <ul className="space-y-2.5">
        {sorted.map((p, i) => (
          <li
            key={p.id}
            className={`flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 font-bold ${
              i === 0 ? "border-amber-500/70 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-950" : "border-[var(--game-wood)]/12 bg-white/55 text-[var(--game-ink)]"
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <PlayerToken playerId={p.id} name={p.name} size={i === 0 ? "lg" : "md"} />
              <span className="truncate">
                {i === 0 ? "우승" : `${i + 1}위`} · {p.name}
              </span>
            </span>
            <span className="shrink-0 text-lg text-amber-800">⭐ {scores[p.id] ?? 0}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="game-btn-cta text-base" onClick={resetGame}>
        새 게임
      </button>
    </section>
  );
}
