import { useGameStore } from "../store/gameStore";

export function GameEndPhase() {
  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const resetGame = useGameStore((s) => s.resetGame);
  const sorted = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">🏆 게임 종료!</h2>
      <ul className="space-y-2">
        {sorted.map((p, i) => (
          <li key={p.id} className="rounded-lg bg-slate-50 p-3">
            {i + 1}등 {p.name} · ⭐ {scores[p.id] ?? 0}
          </li>
        ))}
      </ul>
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white" onClick={resetGame}>
        새로운 게임 시작
      </button>
    </section>
  );
}
