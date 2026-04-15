import { useCallback, useEffect, useRef, useState } from "react";
import { PhaseCountdown } from "./PhaseCountdown";
import { useGameStore } from "../store/gameStore";

export function StoryPhase() {
  const situation = useGameStore((s) => s.situation);
  const currentRound = useGameStore((s) => s.currentRound);
  const setSituation = useGameStore((s) => s.setSituation);
  const completeStoryStep = useGameStore((s) => s.completeStoryStep);
  const canNext = situation.trim().length > 0 && situation.length <= 150;
  const [timeUp, setTimeUp] = useState(false);
  const situationRef = useRef(situation);
  situationRef.current = situation;

  const handleExpire = useCallback(() => {
    const text = situationRef.current.trim();
    if (text.length > 0 && text.length <= 150) {
      completeStoryStep();
    } else {
      setTimeUp(true);
    }
  }, [completeStoryStep]);

  useEffect(() => {
    if (situation.trim().length > 0) setTimeUp(false);
  }, [situation]);

  return (
    <section className="game-card space-y-4 p-6 md:p-7">
      <h2 className="game-title text-2xl text-[var(--game-ink)]">이야기 만들기</h2>
      <PhaseCountdown
        resetKey={`story-r${currentRound}`}
        durationSec={120}
        label="남은 시간 (최대 2분)"
        onExpire={handleExpire}
      />
      {timeUp ? (
        <p className="rounded-xl border-2 border-rose-400/50 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-900">
          시간이 종료되었습니다. 이야기를 입력한 뒤 다음 단계로 진행해 주세요.
        </p>
      ) : null}
      <p className="text-sm font-medium text-[var(--game-ink-soft)]">주사위로 나온 조각을 이어 최대 150자까지 적어 보세요.</p>
      <textarea
        className="h-40 w-full resize-y rounded-xl border-2 border-[var(--game-wood)]/25 bg-white/90 p-4 text-[var(--game-ink)] shadow-inner outline-none ring-amber-400/25 focus:border-amber-500/50 focus:ring-2"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="예: 복도 끝에서… (3문장 이내)"
      />
      <p className="text-sm font-semibold text-[var(--game-wood)]">글자 수: {situation.length} / 150</p>
      <button type="button" className="game-btn-cta" disabled={!canNext} onClick={completeStoryStep}>
        다음 단계
      </button>
    </section>
  );
}
