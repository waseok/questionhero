import { useGameStore } from "../store/gameStore";
import type { QuestionType } from "../types/game";

const questionPrompt: Record<QuestionType, string> = {
  confirm: "무엇을? 누가? 어디서?",
  cause: "왜? 어쩌다가?",
  decision: "만약 ~라면? 어떻게?",
};

export function VotingPhase() {
  const players = useGameStore((s) => s.players);
  const picks = useGameStore((s) => s.questionPicks);
  const winner = useGameStore((s) => s.winnerPlayerId);
  const setAnswer = useGameStore((s) => s.setAnswer);
  const setWinnerPlayer = useGameStore((s) => s.setWinnerPlayer);
  const completeVotingStep = useGameStore((s) => s.completeVotingStep);
  const ready = Boolean(winner) && picks.every((p) => p.answer.trim().length > 0);

  return (
    <section className="game-card space-y-4 p-6 md:p-7">
      <h2 className="game-title text-2xl text-[var(--game-ink)]">대답 & 투표</h2>
      {picks.map((pick, idx) => {
        const playerName = players.find((p) => p.id === pick.playerId)?.name ?? pick.playerId;
        return (
          <div key={pick.playerId} className="rounded-xl border-2 border-[var(--game-wood)]/18 bg-white/50 p-4 shadow-inner">
            <p className="font-bold text-[var(--game-ink)]">
              Q{idx + 1} · {playerName}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--game-ink-soft)]">{questionPrompt[pick.type]}</p>
            <textarea
              className="mt-3 min-h-[88px] w-full rounded-xl border-2 border-[var(--game-wood)]/25 bg-white/90 p-3 text-sm text-[var(--game-ink)] outline-none ring-amber-400/25 focus:border-amber-500/50 focus:ring-2"
              placeholder="스토리텔러 답변 입력"
              value={pick.answer}
              onChange={(e) => setAnswer(pick.playerId, e.target.value)}
            />
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--game-ink)]">
              <input
                type="radio"
                className="h-4 w-4 accent-amber-600"
                checked={winner === pick.playerId}
                onChange={() => setWinnerPlayer(pick.playerId)}
              />
              가장 도움이 된 질문으로 선택
            </label>
          </div>
        );
      })}
      <button type="button" className="game-btn-cta" disabled={!ready} onClick={completeVotingStep}>
        투표 완료
      </button>
    </section>
  );
}
