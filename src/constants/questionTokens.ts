import type { QuestionType } from "../types/game";

/** 질문 유형별 짧은 표시 이름 (토큰·배지에 공통 사용) */
export const TOKEN_LABELS: Record<QuestionType, string> = {
  confirm: "🔍 확인 질문",
  cause: "🧩 원인 질문",
  decision: "⚖️ 판단 질문",
};

/** 질문 작성 시 힌트 문구 (스토리텔러가 읽는 프롬프트) */
export const QUESTION_PROMPTS: Record<QuestionType, string> = {
  confirm: "무엇을? 누가? 어디서?",
  cause: "왜? 어쩌다가?",
  decision: "만약 ~라면? 어떻게?",
};
