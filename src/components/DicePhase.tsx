import { useCallback, useEffect, useRef, useState } from "react";
import { DICE_DATA, flattenColorItems } from "../data/diceData";
import { useGameStore } from "../store/gameStore";
import type { DiceColor, DiceItem, DiceSelection } from "../types/game";

/** 색별 카드 제목·구역 색·그리드에서 «뽑힌 면» 강조 */
const colorMeta: Record<DiceColor, { title: string; icon: string; bg: string; ring: string; pick: string }> = {
  blue: {
    title: "파란색(장소)",
    icon: "🟦",
    bg: "bg-blue-50",
    ring: "ring-blue-200/80",
    pick: "bg-blue-200/90 font-semibold text-blue-950 ring-2 ring-blue-600/70 shadow-sm",
  },
  red: {
    title: "빨간색(위협)",
    icon: "🟥",
    bg: "bg-red-50",
    ring: "ring-red-200/80",
    pick: "bg-red-200/90 font-semibold text-red-950 ring-2 ring-red-600/70 shadow-sm",
  },
  yellow: {
    title: "노란색(행동)",
    icon: "🟨",
    bg: "bg-yellow-50",
    ring: "ring-yellow-200/80",
    pick: "bg-amber-200/95 font-semibold text-amber-950 ring-2 ring-amber-500/75 shadow-sm",
  },
};

/** 굴림 결과와 같은 면인지 (아이콘·라벨로 식별) */
function isSameDiceFace(selected: DiceItem | undefined, item: DiceItem): boolean {
  return Boolean(selected && selected.icon === item.icon && selected.label === item.label);
}

const DICE_ORDER: DiceColor[] = ["blue", "red", "yellow"];

/** 현재 모드·테마에 맞는 «이번 굴림에서» 나올 수 있는 후보 목록 */
function buildPoolsFromStore(): Record<DiceColor, DiceItem[]> {
  const { gameMode, themeIndex } = useGameStore.getState();
  if (gameMode === "emergency") {
    return {
      blue: flattenColorItems("blue"),
      red: flattenColorItems("red"),
      yellow: flattenColorItems("yellow"),
    };
  }
  return {
    blue: DICE_DATA.blue[themeIndex.blue],
    red: DICE_DATA.red[themeIndex.red],
    yellow: DICE_DATA.yellow[themeIndex.yellow],
  };
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * 상단에 보이는 주사위 3개: 굴림 중엔 후보 아이콘이 빠르게 바뀌고(tick),
 * 멈춘 뒤에는 스토어에 확정된 결과를 보여줍니다.
 */
function TripleDiceRack(props: {
  rolling: boolean;
  /** 굴림 중에만 사용: 슬롯처럼 바뀌는 임시 면 */
  spinFaces: DiceSelection;
  /** 굴림 종료 후 스토어 결과 */
  finalFaces: DiceSelection;
  /** 결과가 막 떨어졌을 때 등장 모션을 다시 트리거하기 위한 값 */
  landNonce: number;
}) {
  const { rolling, spinFaces, finalFaces, landNonce } = props;

  return (
    <div className="dice-rack-perspective grid grid-cols-1 gap-3 sm:grid-cols-3">
      {DICE_ORDER.map((color, index) => {
        const meta = colorMeta[color];
        const finalItem = finalFaces[color];
        /** 굴림 중이면 tick으로 갱신되는 면, 아니면 확정 면 */
        const face = rolling ? spinFaces[color] : finalItem;
        const icon = face?.icon ?? (rolling ? "🎲" : "❔");
        const label = face?.label ?? (rolling ? "…" : "대기");

        const tumbleClass =
          rolling
            ? `dice-cube-shell dice-cube-shell--rolling ${index === 1 ? "dice-cube-shell--rolling-delay-1" : ""} ${index === 2 ? "dice-cube-shell--rolling-delay-2" : ""}`
            : "dice-cube-shell";

        /** 아직 결과가 없을 때는 팝 모션을 넣지 않음(첫 진입 시 깜빡임 방지) */
        const iconMotionClass = rolling ? "dice-roll-spin inline-block" : finalItem ? "dice-result-pop inline-block" : "inline-block";

        return (
          <div
            key={color}
            className={`flex flex-col items-center rounded-2xl p-4 shadow-inner ring-2 ring-inset ${meta.bg} ${meta.ring}`}
          >
            <p className="mb-3 text-xs font-bold text-[var(--game-wood)]">
              {meta.icon} {meta.title}
            </p>
            <div className={`${tumbleClass} flex min-h-[120px] w-full max-w-[140px] items-center justify-center`}>
              <div
                className={`dice-cube-face flex min-h-[104px] w-full flex-col items-center justify-center rounded-xl border border-white/70 bg-white/90 px-2 py-3 text-center shadow-md ${
                  rolling ? "dice-slot-blur" : ""
                }`}
              >
                {/* landNonce 변경 시 등장 모션(key) 재트리거 */}
                <span key={`${color}-${landNonce}-${rolling ? "spin" : "final"}`} className={`text-5xl leading-none sm:text-6xl ${iconMotionClass}`} aria-hidden>
                  {icon}
                </span>
                <span className={`mt-2 line-clamp-2 text-xs font-semibold text-[var(--game-ink-soft)] ${rolling ? "opacity-80" : ""}`}>{label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  /** 굴림 tick마다 바뀌는 «가짜 면» — 슬롯머신 효과 */
  const [spinFaces, setSpinFaces] = useState<DiceSelection>({});
  /** 결과 막 도착했을 때 팝 모션용 */
  const [landNonce, setLandNonce] = useState(0);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** setState 전에도 연속 클릭으로 이중 굴림이 나가지 않도록 막는 플래그 */
  const rollInFlightRef = useRef(false);

  const ready = Boolean(diceSelection.blue && diceSelection.red && diceSelection.yellow);

  /** 접근성: 모션이 줄어든 환경이면 굴림 시간만 짧게 */
  const rollDurationMs =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 420 : 2600;

  const clearRollTimers = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (finishRef.current) {
      clearTimeout(finishRef.current);
      finishRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      rollInFlightRef.current = false;
      clearRollTimers();
    },
    [clearRollTimers],
  );

  const startRollSequence = useCallback(() => {
    if (rollLocked || rollInFlightRef.current) return;
    rollInFlightRef.current = true;

    clearRollTimers();
    setIsRolling(true);

    const tickMs = rollDurationMs < 600 ? 200 : 85;

    /** 매 tick마다 후보 풀에서 임의 면을 뽑아 화면 갱신 */
    tickRef.current = setInterval(() => {
      const pools = buildPoolsFromStore();
      setSpinFaces({
        blue: randomPick(pools.blue),
        red: randomPick(pools.red),
        yellow: randomPick(pools.yellow),
      });
    }, tickMs);

    finishRef.current = setTimeout(() => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      const m = useGameStore.getState().gameMode;
      if (m === "emergency") {
        autoRollDice();
      } else {
        rollThemeDice();
      }
      setSpinFaces({});
      setIsRolling(false);
      setRollLocked(true);
      setLandNonce((n) => n + 1);
      rollInFlightRef.current = false;
    }, rollDurationMs);
  }, [autoRollDice, clearRollTimers, rollDurationMs, rollLocked, rollThemeDice]);

  const handlePhysicalRoll = () => {
    if (mode === "emergency") {
      startRollSequence();
      return;
    }
    startRollSequence();
  };

  return (
    <section className="game-card space-y-4 p-6 md:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h2 className="game-title text-2xl leading-tight text-[var(--game-ink)]">주사위 선택 단계</h2>
        {mode === "emergency" ? (
          <button
            type="button"
            className={`game-btn-ruby shrink-0 text-sm sm:mt-0.5 ${isRolling ? "animate-pulse" : ""}`}
            onClick={startRollSequence}
            disabled={isRolling || rollLocked}
          >
            {isRolling ? "🎲 굴리는 중…" : rollLocked ? "✅ 결과 고정됨" : "🎲 주사위 던지기"}
          </button>
        ) : (
          <button
            type="button"
            className={`game-btn-indigo shrink-0 text-sm sm:mt-0.5 ${isRolling ? "animate-pulse" : ""}`}
            onClick={startRollSequence}
            disabled={isRolling || rollLocked}
          >
            {isRolling ? "🎲 굴리는 중…" : rollLocked ? "✅ 결과 고정됨" : "🎲 테마 기준 주사위 굴리기"}
          </button>
        )}
      </div>

      <div className="rounded-xl border-2 border-[var(--game-wood)]/20 bg-gradient-to-b from-amber-50/90 to-amber-100/50 p-4 shadow-inner">
        <p className="mb-3 text-center text-sm font-bold text-[var(--game-wood)]">🎲 이번 라운드 주사위 (3개)</p>
        <TripleDiceRack rolling={isRolling} spinFaces={spinFaces} finalFaces={diceSelection} landNonce={landNonce} />
        <p className="mt-3 text-center text-xs font-medium text-[var(--game-ink-soft)]">
          {isRolling ? "주사위가 굴러가는 중…" : rollLocked ? "결과가 확정되었습니다." : "상단의 «굴리기» 버튼을 누르면 면이 빠르게 바뀌다가 결과에 멈춥니다."}
        </p>
      </div>

      {mode === "emergency" ? (
        <div className="space-y-3">
          <button
            type="button"
            className={`dice-action-board w-full rounded-xl border-2 border-dashed border-red-300 bg-red-50 px-4 py-6 text-center ${isShaking ? "dice-shake" : ""} ${isRolling ? "animate-pulse" : ""}`}
            onMouseDown={() => !rollLocked && setIsShaking(true)}
            onMouseUp={() => setIsShaking(false)}
            onMouseLeave={() => setIsShaking(false)}
            onClick={handlePhysicalRoll}
            disabled={isRolling || rollLocked}
          >
            <p className="text-base font-bold">🖐️ 눌러서 흔들고 놓으면 주사위 굴림</p>
            <p className="mt-1 text-sm font-medium text-[var(--game-ink-soft)]">{isRolling ? "3개 주사위 회전 중…" : rollLocked ? "결과가 고정되었습니다" : "실제로 굴리는 액션"}</p>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {DICE_ORDER.map((color) => {
            const items = DICE_DATA[color][themeIndex[color]];
            return (
              <div key={color} className={`rounded-lg p-3 ${colorMeta[color].bg}`}>
                <div className="mb-2 flex items-center justify-between">
                  <strong>
                    {colorMeta[color].icon} {colorMeta[color].title}
                  </strong>
                  <select
                    className="rounded border px-2 py-1 text-sm"
                    value={themeIndex[color]}
                    onChange={(e) => setTheme(color, Number(e.target.value))}
                    disabled={isRolling || rollLocked}
                  >
                    {DICE_DATA[color].map((_, i) => (
                      <option key={i} value={i}>
                        테마 {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const isPicked = isSameDiceFace(diceSelection[color], item);
                    return (
                      <p
                        key={`${item.icon}${item.label}`}
                        className={`rounded-lg px-2 py-2 text-sm transition-[box-shadow,background-color] duration-200 ${
                          isPicked ? colorMeta[color].pick : "bg-white/90 text-[var(--game-ink)]"
                        }`}
                        aria-current={isPicked ? "true" : undefined}
                      >
                        {item.icon} {item.label}
                      </p>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm">
                  결과: {diceSelection[color] ? `🎲 ${diceSelection[color]?.icon} ${diceSelection[color]?.label}` : "(아직 굴리지 않음)"}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <button type="button" className="game-btn-cta" onClick={completeDiceStep} disabled={!ready}>
        다음 단계
      </button>
    </section>
  );
}
