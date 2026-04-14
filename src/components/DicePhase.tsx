import { DICE_DATA } from "../data/diceData";
import { useState } from "react";
import type { DiceColor } from "../types/game";
import { useGameStore } from "../store/gameStore";

const colorMeta: Record<DiceColor, { title: string; icon: string; bg: string }> = {
  blue: { title: "파란색(장소)", icon: "🟦", bg: "bg-blue-50" },
  red: { title: "빨간색(위협)", icon: "🟥", bg: "bg-red-50" },
  yellow: { title: "노란색(행동)", icon: "🟨", bg: "bg-yellow-50" },
};

export function DicePhase() {
  const mode = useGameStore((s) => s.gameMode);
  const diceSelection = useGameStore((s) => s.diceSelection);
  const themeIndex = useGameStore((s) => s.themeIndex);
  const setTheme = useGameStore((s) => s.setTheme);
  const rollThemeDice = useGameStore((s) => s.rollThemeDice);
  const autoRollDice = useGameStore((s) => s.autoRollDice);
  const completeDiceStep = useGameStore((s) => s.completeDiceStep);
  const [isRolling, setIsRolling] = useState(false);
  const [rollLocked, setRollLocked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const ready = Boolean(diceSelection.blue && diceSelection.red && diceSelection.yellow);

  const handleEmergencyRoll = () => {
    if (rollLocked || isRolling) return;
    setIsRolling(true);
    window.setTimeout(() => {
      autoRollDice();
      setIsRolling(false);
      setRollLocked(true);
    }, 1100);
  };

  const handleThemeRoll = () => {
    if (rollLocked || isRolling) return;
    setIsRolling(true);
    window.setTimeout(() => {
      rollThemeDice();
      setIsRolling(false);
      setRollLocked(true);
    }, 900);
  };

  const handlePhysicalRoll = () => {
    if (mode === "emergency") {
      handleEmergencyRoll();
      return;
    }
    handleThemeRoll();
  };

  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">주사위 선택 단계</h2>
      {mode === "emergency" ? (
        <div className="space-y-3">
          <button
            className={`dice-action-board w-full rounded-xl border-2 border-dashed border-red-300 bg-red-50 px-4 py-6 text-center ${isShaking ? "dice-shake" : ""} ${isRolling ? "animate-pulse" : ""}`}
            onMouseDown={() => !rollLocked && setIsShaking(true)}
            onMouseUp={() => setIsShaking(false)}
            onMouseLeave={() => setIsShaking(false)}
            onClick={handlePhysicalRoll}
            disabled={isRolling || rollLocked}
          >
            <p className="text-base font-bold">🖐️ 눌러서 흔들고 놓으면 주사위 굴림</p>
            <p className="mt-1 text-sm text-slate-600">{isRolling ? "드럼롤..." : rollLocked ? "결과가 고정되었습니다" : "실제로 굴리는 액션"}</p>
          </button>
          <button
            className={`rounded-lg bg-red-600 px-4 py-2 text-white ${isRolling ? "animate-pulse" : ""} disabled:opacity-50`}
            onClick={handleEmergencyRoll}
            disabled={isRolling || rollLocked}
          >
            {isRolling ? "🎲 드럼롤..." : rollLocked ? "✅ 결과 고정됨" : "🎲 주사위 던지기"}
          </button>
          {(["blue", "red", "yellow"] as DiceColor[]).map((c) => (
            <p key={c} className={`rounded-lg p-2 ${colorMeta[c].bg} transition-all ${isRolling ? "animate-bounce" : ""}`}>
              <span className={isRolling ? "dice-roll-spin inline-block" : "inline-block"}>{colorMeta[c].icon}</span>{" "}
              <span className={isRolling ? "dice-roll-spin inline-block [animation-delay:100ms]" : "inline-block"}>
                {diceSelection[c]?.icon ?? "❔"}
              </span>{" "}
              {diceSelection[c]?.label ?? "(미선택)"}
            </p>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {(["blue", "red", "yellow"] as DiceColor[]).map((color) => {
            const items = DICE_DATA[color][themeIndex[color]];
            return (
              <div key={color} className={`rounded-lg p-3 ${colorMeta[color].bg}`}>
                <div className="mb-2 flex items-center justify-between">
                  <strong>{colorMeta[color].icon} {colorMeta[color].title}</strong>
                  <select className="rounded border px-2 py-1 text-sm" value={themeIndex[color]} onChange={(e) => setTheme(color, Number(e.target.value))}>
                    {DICE_DATA[color].map((_, i) => <option key={i} value={i}>테마 {i + 1}</option>)}
                  </select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <p key={`${item.icon}${item.label}`} className="rounded-lg bg-white px-2 py-2 text-sm">
                      {item.icon} {item.label}
                    </p>
                  ))}
                </div>
                <p className="mt-2 text-sm">결과: {diceSelection[color] ? `🎲 ${diceSelection[color]?.icon} ${diceSelection[color]?.label}` : "(아직 굴리지 않음)"}</p>
              </div>
            );
          })}
          <button
            className={`rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50 ${isRolling ? "animate-pulse" : ""}`}
            onClick={handleThemeRoll}
            disabled={isRolling || rollLocked}
          >
            {isRolling ? "🎲 드럼롤..." : rollLocked ? "✅ 결과 고정됨" : "🎲 테마 기준 주사위 굴리기 (강제)"}
          </button>
        </div>
      )}
      <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-40" onClick={completeDiceStep} disabled={!ready}>
        다음 단계
      </button>
    </section>
  );
}
