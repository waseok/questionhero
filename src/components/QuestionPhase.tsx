import { useGameStore } from "../store/gameStore";
import { useState } from "react";
import type { QuestionType } from "../types/game";

const tokenLabels: Record<QuestionType, string> = {
  confirm: "🔍 확인 질문",
  cause: "🧩 원인 질문",
  decision: "⚖️ 판단 질문",
};

export function QuestionPhase() {
  const [isAssigning, setIsAssigning] = useState(false);
  const players = useGameStore((s) => s.players);
  const picks = useGameStore((s) => s.questionPicks);
  const tokens = useGameStore((s) => s.questionTokens);
  const questionTokensAssigned = useGameStore((s) => s.questionTokensAssigned);
  const randomizeQuestionTokens = useGameStore((s) => s.randomizeQuestionTokens);
  const completeQuestionsStep = useGameStore((s) => s.completeQuestionsStep);
  const canNext = picks.length === 3 && questionTokensAssigned;
  const handleRandomize = () => {
    if (questionTokensAssigned || isAssigning) return;
    setIsAssigning(true);
    window.setTimeout(() => {
      randomizeQuestionTokens();
      setIsAssigning(false);
    }, 1000);
  };

  return (
    <section className="game-card space-y-4 p-6 md:p-7">
      <h2 className="game-title text-2xl text-[var(--game-ink)]">질문 토큰 배정</h2>
      <div className="rounded-xl border-2 border-[var(--game-wood)]/20 bg-amber-50/70 p-3 text-sm font-semibold text-[var(--game-wood)]">
        {questionTokensAssigned ? (
          <>배정 완료: 확인·원인·판단이 플레이어당 한 번씩만 나갔습니다.</>
        ) : (
          <>
            배정 전 재고 · 확인 {tokens.confirm} / 원인 {tokens.cause} / 판단 {tokens.decision}
            <span className="mt-1 block text-xs font-medium text-[var(--game-ink-soft)]">무작위 뽑기 시 세 유형이 중복 없이 한 명씩 배정됩니다.</span>
          </>
        )}
      </div>
      <button
        type="button"
        className={`game-btn-indigo ${isAssigning ? "animate-pulse" : ""}`}
        onClick={handleRandomize}
        disabled={questionTokensAssigned || isAssigning}
      >
        {isAssigning ? "🎲 질문 토큰 배정 중..." : questionTokensAssigned ? "✅ 토큰 배정 완료" : "🎲 질문 토큰 무작위 뽑기"}
      </button>
      {picks.map((pick) => {
        const playerName = players.find((p) => p.id === pick.playerId)?.name ?? pick.playerId;
        return (
          <div key={pick.playerId} className="rounded-xl border-2 border-[var(--game-wood)]/18 bg-white/50 p-4 shadow-inner">
            <p className="mb-2 font-bold text-[var(--game-ink)]">{playerName}</p>
            <p
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                isAssigning ? "token-shuffle bg-indigo-100/80 text-indigo-950" : "bg-amber-50/80 text-[var(--game-ink-soft)]"
              }`}
            >
              {isAssigning ? "섞는 중..." : questionTokensAssigned ? `✓ ${tokenLabels[pick.type]}` : "대기 중… (아직 배정 안 됨)"}
            </p>
          </div>
        );
      })}
      <button type="button" className="game-btn-cta" disabled={!canNext} onClick={completeQuestionsStep}>
        배정 완료
      </button>
    </section>
  );
}
