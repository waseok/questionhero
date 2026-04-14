import { useGameStore } from "../store/gameStore";

export function SetupScreen() {
  const players = useGameStore((s) => s.players);
  const gameMode = useGameStore((s) => s.gameMode);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setMode = useGameStore((s) => s.setMode);
  const startGame = useGameStore((s) => s.startGame);
  const canStart = players.every((p) => p.name.trim().length > 0);

  return (
    <section className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">🎲 SAFE 게임 - 나를 구해줘!</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {players.map((p) => (
          <label key={p.id} className="text-sm">
            {p.id.toUpperCase()}
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={p.name}
              onChange={(e) => setPlayerName(p.id, e.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-semibold">게임 모드</p>
        <button className={`mr-2 rounded-lg px-3 py-2 ${gameMode === "thoughtful" ? "bg-blue-600 text-white" : "bg-slate-100"}`} onClick={() => setMode("thoughtful")}>신중한 판단</button>
        <button className={`rounded-lg px-3 py-2 ${gameMode === "emergency" ? "bg-red-600 text-white" : "bg-slate-100"}`} onClick={() => setMode("emergency")}>긴급 대응</button>
      </div>
      <button
        className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-40"
        disabled={!canStart}
        onClick={startGame}
      >
        게임 시작
      </button>
    </section>
  );
}
