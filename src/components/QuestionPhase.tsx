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
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">질문 토큰 무작위 배정</h2>
      <div className="rounded-lg bg-slate-50 p-3 text-sm">
        남은 토큰 · 확인 {tokens.confirm} / 원인 {tokens.cause} / 판단 {tokens.decision}
      </div>
      <button
        className={`rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50 ${isAssigning ? "animate-pulse" : ""}`}
        onClick={handleRandomize}
        disabled={questionTokensAssigned || isAssigning}
      >
        {isAssigning ? "🎲 질문 토큰 배정 중..." : questionTokensAssigned ? "✅ 토큰 배정 완료" : "🎲 질문 토큰 무작위 뽑기 (강제)"}
      </button>
      {picks.map((pick) => {
        const playerName = players.find((p) => p.id === pick.playerId)?.name ?? pick.playerId;
        return (
          <div key={pick.playerId} className="rounded-lg border p-3">
            <p className="mb-2 font-semibold">{playerName}</p>
            <p className={`rounded px-3 py-2 text-sm ${isAssigning ? "token-shuffle bg-indigo-50" : "bg-slate-50"}`}>
              {isAssigning ? "섞는 중..." : questionTokensAssigned ? `✓ ${tokenLabels[pick.type]}` : "대기 중... (아직 배정 안됨)"}
            </p>
          </div>
        );
      })}
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-40" disabled={!canNext} onClick={completeQuestionsStep}>
        배정 완료
      </button>
    </section>
  );
}
