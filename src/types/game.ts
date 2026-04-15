export type GameMode = "thoughtful" | "emergency";
export type GameStep =
  | "setup"
  | "dice"
  | "story"
  | "questions"
  | "voting"
  | "round_end"
  | "game_end";
export type DiceColor = "blue" | "red" | "yellow";
export type QuestionType = "confirm" | "cause" | "decision";

export interface DiceItem {
  icon: string;
  label: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface DiceSelection {
  blue?: DiceItem;
  red?: DiceItem;
  yellow?: DiceItem;
}

export interface QuestionPick {
  playerId: string;
  type: QuestionType;
  answer: string;
}

/** Supabase 등으로 동기화하는 게임 상태 스냅샷 (함수 제외) */
export interface GameSnapshot {
  players: Player[];
  gameMode: GameMode;
  step: GameStep;
  currentRound: number;
  storytellerId: string;
  themeIndex: Record<DiceColor, number>;
  diceSelection: DiceSelection;
  situation: string;
  questionTokens: Record<QuestionType, number>;
  questionPicks: QuestionPick[];
  questionTokensAssigned: boolean;
  winnerPlayerId?: string;
  scores: Record<string, number>;
  roundHistory: { round: number; winnerPlayerId: string; winnerCoins: number }[];
}
