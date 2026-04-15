import type { QuestionType } from "../types/game";
import { TOKEN_LABELS } from "../constants/questionTokens";

type Props = {
  /** 배정된 유형. null이면 아직 배정 전 */
  type: QuestionType | null;
  /** 섞는 중 등 로딩 표시 */
  pending?: boolean;
  /** 레이아웃 크기 */
  size?: "sm" | "md";
};

const tone: Record<QuestionType, string> = {
  confirm: "border-indigo-400/50 bg-indigo-50/95 text-indigo-950",
  cause: "border-emerald-500/45 bg-emerald-50/95 text-emerald-950",
  decision: "border-amber-600/45 bg-amber-50/95 text-amber-950",
};

/**
 * 플레이어에게 배정된 질문 토큰을 카드형 배지로 보여줍니다.
 * 배정 전에는 점선 테두리의 빈 슬롯을 표시합니다.
 */
export function QuestionTokenBadge({ type, pending = false, size = "md" }: Props) {
  const pad = size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm";

  if (pending) {
    return (
      <div
        className={`inline-flex max-w-full items-center rounded-xl border-2 border-dashed border-indigo-300/70 bg-indigo-50/80 font-semibold text-indigo-950 ${pad}`}
      >
        섞는 중…
      </div>
    );
  }

  if (!type) {
    return (
      <div
        className={`inline-flex max-w-full items-center rounded-xl border-2 border-dashed border-[var(--game-wood)]/35 bg-white/40 font-semibold text-[var(--game-ink-soft)] ${pad}`}
      >
        토큰 미배정
      </div>
    );
  }

  return (
    <div
      className={`inline-flex max-w-full items-center rounded-xl border-2 font-bold shadow-sm ${tone[type]} ${pad}`}
      role="status"
      aria-label={`배정된 질문 토큰: ${TOKEN_LABELS[type]}`}
    >
      {TOKEN_LABELS[type]}
    </div>
  );
}
