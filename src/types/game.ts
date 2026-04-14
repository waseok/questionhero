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
