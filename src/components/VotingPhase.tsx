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
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">대답 & 투표</h2>
      {picks.map((pick, idx) => {
        const playerName = players.find((p) => p.id === pick.playerId)?.name ?? pick.playerId;
        return (
          <div key={pick.playerId} className="rounded-lg border p-3">
            <p className="font-semibold">Q{idx + 1} [{playerName}] {questionPrompt[pick.type]}</p>
            <textarea
              className="mt-2 w-full rounded-lg border p-2"
              placeholder="스토리텔러 답변 입력"
              value={pick.answer}
              onChange={(e) => setAnswer(pick.playerId, e.target.value)}
            />
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" checked={winner === pick.playerId} onChange={() => setWinnerPlayer(pick.playerId)} />
              가장 도움이 된 질문으로 선택
            </label>
          </div>
        );
      })}
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-40" disabled={!ready} onClick={completeVotingStep}>
        투표 완료
      </button>
    </section>
  );
}
