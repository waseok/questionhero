import { useGameStore } from "../store/gameStore";
import { QUESTION_PROMPTS } from "../constants/questionTokens";
import { QuestionTokenBadge } from "./QuestionTokenBadge";

/** SAFE 게임 질문 가이드 카드 (디자인 이미지, `public/question-guide-safe-card.png`) */
const QUESTION_GUIDE_CARD_SRC = "/question-guide-safe-card.png";

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
      <p className="text-sm font-medium text-[var(--game-ink-soft)]">각 플레이어는 배정된 질문 토큰 유형에 맞춰 스토리텔러에게 질문을 적습니다.</p>

      {/* 넓은 화면: 질문 입력(왼쪽) + 가이드 카드(오른쪽 고정 느낌) */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1 space-y-4">
          {picks.map((pick, idx) => {
            const playerName = players.find((p) => p.id === pick.playerId)?.name ?? pick.playerId;
            return (
              <div key={pick.playerId} className="rounded-xl border-2 border-[var(--game-wood)]/18 bg-white/50 p-4 shadow-inner">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--game-ink)]">
                      Q{idx + 1} · {playerName}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--game-ink-soft)]">{QUESTION_PROMPTS[pick.type]}</p>
                  </div>
                  {/* 이 플레이어에게 배정된 토큰을 항상 눈에 띄게 */}
                  <QuestionTokenBadge type={pick.type} size="sm" />
                </div>
                <textarea
                  className="mt-3 min-h-[88px] w-full rounded-xl border-2 border-[var(--game-wood)]/25 bg-white/90 p-3 text-sm text-[var(--game-ink)] outline-none ring-amber-400/25 focus:border-amber-500/50 focus:ring-2"
                  placeholder="스토리텔러에게 할 질문을 입력하세요"
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
        </div>

        <aside className="shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,360px)]">
          <div className="overflow-hidden rounded-2xl border-2 border-[var(--game-wood)]/25 bg-white/90 shadow-md">
            <img
              src={QUESTION_GUIDE_CARD_SRC}
              alt="SAFE 게임 질문 가이드 — 확인·원인·판단 질문 안내"
              width={720}
              height={1280}
              className="mx-auto block h-auto w-full max-w-[min(100%,340px)] object-contain"
              loading="lazy"
            />
          </div>
        </aside>
      </div>

      <button type="button" className="game-btn-cta" disabled={!ready} onClick={completeVotingStep}>
        투표 완료
      </button>
    </section>
  );
}
