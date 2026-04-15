import type { GameSnapshot } from "../types/game";

/** gameStore.getState()에서 Realtime 동기화용 JSON만 추출합니다. */
export function buildGameSnapshotFromStoreState(s: GameSnapshot & Record<string, unknown>): GameSnapshot {
  return {
    players: s.players,
    gameMode: s.gameMode,
    step: s.step,
    currentRound: s.currentRound,
    storytellerId: s.storytellerId,
    themeIndex: { ...s.themeIndex },
    diceSelection: { ...s.diceSelection },
    situation: s.situation,
    questionTokens: { ...s.questionTokens },
    questionPicks: s.questionPicks.map((q) => ({ ...q })),
    questionTokensAssigned: s.questionTokensAssigned,
    winnerPlayerId: s.winnerPlayerId,
    scores: { ...s.scores },
    roundHistory: s.roundHistory.map((r) => ({ ...r })),
  };
}
