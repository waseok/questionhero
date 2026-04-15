import { useEffect, useRef, useState } from "react";

type Props = {
  /** 이 값이 바뀌면 타이머가 처음부터 다시 시작됩니다(라운드 등). */
  resetKey: string;
  /** 제한 시간(초). 기본 2분. */
  durationSec?: number;
  /** 시간이 0이 되었을 때 한 번만 호출됩니다. */
  onExpire: () => void;
  /** 상단에 붙는 라벨 */
  label: string;
};

/**
 * 단계별 제한 시간 표시(분:초).
 * `resetKey`가 바뀌면 남은 시간이 `durationSec`으로 리셋됩니다.
 */
export function PhaseCountdown({ resetKey, durationSec = 120, onExpire, label }: Props) {
  const [remaining, setRemaining] = useState(durationSec);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    expiredRef.current = false;
    setRemaining(durationSec);
    const deadline = Date.now() + durationSec * 1000;

    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [resetKey, durationSec]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const urgent = remaining <= 30 && remaining > 0;
  const done = remaining <= 0;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold ${
        done
          ? "border-rose-500/50 bg-rose-50 text-rose-900"
          : urgent
            ? "border-amber-600/60 bg-amber-100 text-amber-950"
            : "border-[var(--game-wood)]/20 bg-white/70 text-[var(--game-ink)]"
      }`}
      role="timer"
      aria-live="polite"
    >
      <span className="text-[var(--game-ink-soft)]">{label}</span>
      <span className="tabular-nums">
        {m}:{s.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
