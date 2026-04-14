import { create } from "zustand";
import { DICE_DATA, flattenColorItems } from "../data/diceData";
import type {
  DiceColor,
  DiceItem,
  DiceSelection,
  GameMode,
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
  questionTokens: { confirm: 2, cause: 2, decision: 2 },
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
      questionTokens: { confirm: 2, cause: 2, decision: 2 },
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
      questionTokens: { confirm: 2, cause: 2, decision: 2 },
      questionTokensAssigned: false,
      step: "questions",
    });
  },
  pickQuestionToken: (playerId, type) =>
    set((state) => {
      const current = state.questionPicks.find((q) => q.playerId === playerId);
      if (!current) return state;
      if (current.type === type) return state;
      if (state.questionTokens[type] <= 0) return state;
      return {
        questionTokens: {
          ...state.questionTokens,
          [current.type]: state.questionTokens[current.type] + 1,
          [type]: state.questionTokens[type] - 1,
        },
        questionPicks: state.questionPicks.map((q) => (q.playerId === playerId ? { ...q, type } : q)),
      };
    }),
  randomizeQuestionTokens: () =>
    set((state) => {
      const pool: QuestionType[] = ["confirm", "confirm", "cause", "cause", "decision", "decision"];
      const randomized = state.questionPicks.map((pick) => {
        const idx = Math.floor(Math.random() * pool.length);
        const [type] = pool.splice(idx, 1);
        return { ...pick, type };
      });
      const used = randomized.reduce(
        (acc, pick) => {
          acc[pick.type] += 1;
          return acc;
        },
        { confirm: 0, cause: 0, decision: 0 } as Record<QuestionType, number>,
      );
      return {
        questionPicks: randomized,
        questionTokensAssigned: true,
        questionTokens: {
          confirm: 2 - used.confirm,
          cause: 2 - used.cause,
          decision: 2 - used.decision,
        },
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
      questionTokens: { confirm: 2, cause: 2, decision: 2 },
      themeIndex: {
        blue: Math.floor(Math.random() * DICE_DATA.blue.length),
        red: Math.floor(Math.random() * DICE_DATA.red.length),
        yellow: Math.floor(Math.random() * DICE_DATA.yellow.length),
      },
    });
  },
  resetGame: () => set(initialState()),
}));

export const TOTAL_GAME_ROUNDS = TOTAL_ROUNDS;
