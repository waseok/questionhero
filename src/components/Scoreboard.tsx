import { useState } from "react";
import { useGameStore } from "../store/gameStore";

export function Scoreboard() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const roundHistory = useGameStore((s) => s.roundHistory);
  const sorted = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  return (
    <aside className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-bold">실시간 점수판</h3>
      <ul className="space-y-2 text-sm">
        {sorted.map((p, index) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span>{index + 1}등 · {p.name}</span>
            <span className="font-semibold">⭐ {scores[p.id] ?? 0}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-3">
        <button
          className="mb-2 w-full rounded-lg bg-slate-100 px-2 py-1 text-left text-sm font-bold md:cursor-default md:bg-transparent md:px-0 md:py-0"
          onClick={() => setHistoryOpen((prev) => !prev)}
          type="button"
        >
          라운드 히스토리 <span className="md:hidden">{historyOpen ? "▲" : "▼"}</span>
        </button>
        <ul className={`space-y-1 text-xs text-slate-600 ${historyOpen ? "block" : "hidden"} md:block`}>
          {roundHistory.length === 0 && <li>아직 기록이 없습니다.</li>}
          {[...roundHistory].slice(-5).reverse().map((entry) => {
            const winnerName = players.find((p) => p.id === entry.winnerPlayerId)?.name ?? entry.winnerPlayerId;
            return (
              <li key={`${entry.round}-${entry.winnerPlayerId}`} className="rounded bg-slate-50 px-2 py-1">
                R{entry.round}: {winnerName} +1 (총 {entry.winnerCoins})
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
