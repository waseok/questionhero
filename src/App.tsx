import { DicePhase } from "./components/DicePhase";
import { GameEndPhase } from "./components/GameEndPhase";
import { QuestionPhase } from "./components/QuestionPhase";
import { RoundEndPhase } from "./components/RoundEndPhase";
import { Scoreboard } from "./components/Scoreboard";
import { SetupScreen } from "./components/SetupScreen";
import { StoryPhase } from "./components/StoryPhase";
import { VotingPhase } from "./components/VotingPhase";
import { TOTAL_GAME_ROUNDS, useGameStore } from "./store/gameStore";

function App() {
  const step = useGameStore((s) => s.step);
  const currentRound = useGameStore((s) => s.currentRound);
  const players = useGameStore((s) => s.players);
  const storytellerId = useGameStore((s) => s.storytellerId);
  const diceSelection = useGameStore((s) => s.diceSelection);
  const situation = useGameStore((s) => s.situation);
  const storyteller = players.find((p) => p.id === storytellerId)?.name ?? storytellerId;

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 md:p-6">
      <header className="sticky top-0 z-10 mb-4 rounded-xl bg-slate-900 p-4 text-white shadow-sm">
        <p className="text-lg font-bold">🎮 질문 히어로</p>
        <p className="text-sm">
          라운드 {currentRound}/{TOTAL_GAME_ROUNDS} · 스토리텔러: {storyteller}
        </p>
        {step !== "setup" && (
          <p className="mt-2 text-xs text-slate-200">
            상황: {diceSelection.blue?.icon} {diceSelection.blue?.label} | {diceSelection.red?.icon} {diceSelection.red?.label} | {diceSelection.yellow?.icon} {diceSelection.yellow?.label}
            {situation ? ` | "${situation}"` : ""}
          </p>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <section key={step} className="step-fade">
          {step === "setup" && <SetupScreen />}
          {step === "dice" && <DicePhase />}
          {step === "story" && <StoryPhase />}
          {step === "questions" && <QuestionPhase />}
          {step === "voting" && <VotingPhase />}
          {step === "round_end" && <RoundEndPhase />}
          {step === "game_end" && <GameEndPhase />}
        </section>
        <Scoreboard />
      </div>
    </main>
  );
}

export default App;
