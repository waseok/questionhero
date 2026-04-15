import { create } from "zustand";
import { DICE_DATA, flattenColorItems } from "../data/diceData";
import type {
  DiceColor,
  DiceItem,
  DiceSelection,
  GameMode,
  GameSnapshot,
  GameStep,
  Player,
  QuestionPick,
  QuestionType,
} from "../types/game";

const TOTAL_ROUNDS = 8;
const playerIds = ["p1", "p2", "p3", "p4"];

const getStorytellerIndex = (round: number) => (round - 1) % 4;
const getNextStep = (round: number): GameStep => (round >= TOTAL_ROUNDS ? "game_end" : "round_end");

const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const defaultPlayers = (): Player[] => playerIds.map((id, index) => ({ id, name: `플레이어${index + 1}` }));

/** 질문 유형 3종 — 스토리텔러 제외 3명에게 각각 하나씩만 배정 */
const QUESTION_TYPES_UNIQUE: QuestionType[] = ["confirm", "cause", "decision"];

function shuffledQuestionTypes(): QuestionType[] {
  const arr = [...QUESTION_TYPES_UNIQUE];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

interface GameState {
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

  setPlayerName: (playerId: string, name: string) => void;
  setMode: (mode: GameMode) => void;
  startGame: () => void;
  setTheme: (color: DiceColor, index: number) => void;
  chooseDice: (color: DiceColor, item: DiceItem) => void;
  rollThemeDice: () => void;
  autoRollDice: () => void;
  completeDiceStep: () => void;
  setSituation: (text: string) => void;
  completeStoryStep: () => void;
  pickQuestionToken: (playerId: string, type: QuestionType) => void;
  randomizeQuestionTokens: () => void;
  completeQuestionsStep: () => void;
  setAnswer: (playerId: string, text: string) => void;
  setWinnerPlayer: (playerId: string) => void;
  completeVotingStep: () => void;
  nextRound: () => void;
  resetGame: () => void;
  /** 온라인 방에서 받은 상태로 덮어씁니다(함수 필드는 유지). */
  applyRemoteSnapshot: (snap: GameSnapshot) => void;
}

const buildScoreMap = () => Object.fromEntries(playerIds.map((id) => [id, 0]));

const initialState = () => ({
  players: defaultPlayers(),
  gameMode: "thoughtful" as GameMode,
  step: "setup" as GameStep,
  currentRound: 1,
  storytellerId: "p1",
  themeIndex: { blue: 0, red: 0, yellow: 0 },
  diceSelection: {},
  situation: "",
  questionTokens: { confirm: 1, cause: 1, decision: 1 },
  questionPicks: [] as QuestionPick[],
  questionTokensAssigned: false,
  winnerPlayerId: undefined as string | undefined,
  scores: buildScoreMap(),
  roundHistory: [] as { round: number; winnerPlayerId: string; winnerCoins: number }[],
});

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState(),
  setPlayerName: (playerId, name) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, name } : p)),
    })),
  setMode: (mode) => set({ gameMode: mode }),
  startGame: () =>
    set({
      step: "dice",
      storytellerId: playerIds[getStorytellerIndex(1)],
      currentRound: 1,
      scores: buildScoreMap(),
      situation: "",
      questionPicks: [],
      questionTokensAssigned: false,
      questionTokens: { confirm: 1, cause: 1, decision: 1 },
      winnerPlayerId: undefined,
      roundHistory: [],
      diceSelection: {},
      themeIndex: {
        blue: Math.floor(Math.random() * 6),
        red: Math.floor(Math.random() * 6),
        yellow: Math.floor(Math.random() * 6),
      },
    }),
  setTheme: (color, index) =>
    set((state) => ({ themeIndex: { ...state.themeIndex, [color]: index }, diceSelection: { ...state.diceSelection, [color]: undefined } })),
  chooseDice: (color, item) => set((state) => ({ diceSelection: { ...state.diceSelection, [color]: item } })),
  rollThemeDice: () => {
    const { themeIndex } = get();
    set({
      diceSelection: {
        blue: randomFrom(DICE_DATA.blue[themeIndex.blue]),
        red: randomFrom(DICE_DATA.red[themeIndex.red]),
        yellow: randomFrom(DICE_DATA.yellow[themeIndex.yellow]),
      },
    });
  },
  autoRollDice: () =>
    set({
      diceSelection: {
        blue: randomFrom(flattenColorItems("blue")),
        red: randomFrom(flattenColorItems("red")),
        yellow: randomFrom(flattenColorItems("yellow")),
      },
    }),
  completeDiceStep: () => set({ step: "story" }),
  setSituation: (text) => set({ situation: text.slice(0, 150) }),
  completeStoryStep: () => {
    const { players, storytellerId } = get();
    const picks = players
      .filter((p) => p.id !== storytellerId)
      .map((p) => ({ playerId: p.id, type: "confirm" as QuestionType, answer: "" }));
    set({
      questionPicks: picks,
      questionTokens: { confirm: 1, cause: 1, decision: 1 },
      questionTokensAssigned: false,
      step: "questions",
    });
  },
  /** 같은 유형이 두 명에게 가지 않도록, 목표 유형을 가진 다른 플레이어와 맞교환만 허용 */
  pickQuestionToken: (playerId, type) =>
    set((state) => {
      const me = state.questionPicks.find((q) => q.playerId === playerId);
      if (!me || me.type === type) return state;
      const partner = state.questionPicks.find((q) => q.playerId !== playerId && q.type === type);
      if (!partner) return state;
      return {
        questionPicks: state.questionPicks.map((q) => {
          if (q.playerId === playerId) return { ...q, type };
          if (q.playerId === partner.playerId) return { ...q, type: me.type };
          return q;
        }),
      };
    }),
  /** 확인·원인·판단을 스토리텔러 제외 3명에게 유형당 정확히 1번씩 무작위 배정 */
  randomizeQuestionTokens: () =>
    set((state) => {
      const picks = state.questionPicks;
      const types = shuffledQuestionTypes();
      const randomized = picks.map((pick, i) => ({ ...pick, type: types[i]! }));
      return {
        questionPicks: randomized,
        questionTokensAssigned: true,
        questionTokens: { confirm: 0, cause: 0, decision: 0 },
      };
    }),
  completeQuestionsStep: () => set({ step: "voting" }),
  setAnswer: (playerId, text) =>
    set((state) => ({
      questionPicks: state.questionPicks.map((q) => (q.playerId === playerId ? { ...q, answer: text } : q)),
    })),
  setWinnerPlayer: (playerId) => set({ winnerPlayerId: playerId }),
  completeVotingStep: () => {
    const { winnerPlayerId, scores, currentRound, roundHistory } = get();
    if (!winnerPlayerId) return;
    const nextCoins = (scores[winnerPlayerId] ?? 0) + 1;
    set({
      scores: { ...scores, [winnerPlayerId]: nextCoins },
      roundHistory: [...roundHistory, { round: currentRound, winnerPlayerId, winnerCoins: nextCoins }],
      step: getNextStep(currentRound),
    });
  },
  nextRound: () => {
    const { currentRound } = get();
    const nextRound = currentRound + 1;
    set({
      currentRound: nextRound,
      storytellerId: playerIds[getStorytellerIndex(nextRound)],
      step: "dice",
      situation: "",
      questionPicks: [],
      questionTokensAssigned: false,
      winnerPlayerId: undefined,
      diceSelection: {},
      questionTokens: { confirm: 1, cause: 1, decision: 1 },
      themeIndex: {
        blue: Math.floor(Math.random() * DICE_DATA.blue.length),
        red: Math.floor(Math.random() * DICE_DATA.red.length),
        yellow: Math.floor(Math.random() * DICE_DATA.yellow.length),
      },
    });
  },
  resetGame: () => set(initialState()),
  applyRemoteSnapshot: (snap) =>
    set((prev) => ({
      ...prev,
      players: snap.players,
      gameMode: snap.gameMode,
      step: snap.step,
      currentRound: snap.currentRound,
      storytellerId: snap.storytellerId,
      themeIndex: snap.themeIndex,
      diceSelection: snap.diceSelection,
      situation: snap.situation,
      questionTokens: snap.questionTokens,
      questionPicks: snap.questionPicks,
      questionTokensAssigned: snap.questionTokensAssigned,
      winnerPlayerId: snap.winnerPlayerId,
      scores: snap.scores,
      roundHistory: snap.roundHistory,
    })),
}));

export const TOTAL_GAME_ROUNDS = TOTAL_ROUNDS;
