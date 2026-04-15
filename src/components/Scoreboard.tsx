import { useState } from "react";
import { PlayerToken } from "./PlayerToken";
import { useGameStore } from "../store/gameStore";

export function Scoreboard() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const roundHistory = useGameStore((s) => s.roundHistory);
  const sorted = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  return (
    <aside className="game-aside p-4 md:p-5">
      <h3 className="game-title mb-4 text-xl text-amber-100">점수 판</h3>
      <ul className="space-y-2.5 text-sm">
        {sorted.map((p, index) => (
          <li key={p.id} className="game-aside-chip flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="flex min-w-0 items-center gap-2.5">
              <PlayerToken playerId={p.id} name={p.name} />
              <span className="min-w-0 truncate text-amber-50/95">
                <span className="text-amber-400/90">{index + 1}위</span> · {p.name}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-black/25 px-2 py-0.5 text-xs font-black text-amber-300">★ {scores[p.id] ?? 0}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-amber-200/15 pt-4">
        <button
          className="mb-2 w-full rounded-lg bg-amber-100/10 px-2 py-2 text-left text-sm font-bold text-amber-100/95 hover:bg-amber-100/15 md:cursor-default md:bg-transparent md:px-0 md:py-0 md:hover:bg-transparent"
          onClick={() => setHistoryOpen((prev) => !prev)}
          type="button"
        >
          라운드 기록 <span className="md:hidden">{historyOpen ? "▲" : "▼"}</span>
        </button>
        <ul className={`space-y-1.5 text-xs text-amber-100/75 ${historyOpen ? "block" : "hidden"} md:block`}>
          {roundHistory.length === 0 && <li className="text-amber-200/50">아직 기록이 없습니다.</li>}
          {[...roundHistory].slice(-5).reverse().map((entry) => {
            const winnerName = players.find((pl) => pl.id === entry.winnerPlayerId)?.name ?? entry.winnerPlayerId;
            return (
              <li key={`${entry.round}-${entry.winnerPlayerId}`} className="game-aside-chip px-2.5 py-1.5 text-amber-50/90">
                R{entry.round}: {winnerName} +1 <span className="text-amber-400/80">(총 {entry.winnerCoins})</span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
