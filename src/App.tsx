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
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-10 pt-4 md:px-6 md:pb-14 md:pt-6">
      <header className="game-header sticky top-0 z-10 mb-5 p-4 md:mb-6 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="m-0 min-w-0 shrink">
            <img
              src="/logo-question-hero.png"
              alt="질문 히어로"
              width={280}
              height={120}
              decoding="async"
              className="h-11 w-auto max-w-[min(100%,220px)] object-contain object-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:h-14 md:max-w-[min(100%,280px)]"
            />
          </h1>
          <span className="rounded-full border border-amber-400/40 bg-black/20 px-3 py-1 text-xs font-bold text-amber-100/95">
            라운드 {currentRound}/{TOTAL_GAME_ROUNDS}
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-amber-50/95">
          스토리텔러: <span className="text-white">{storyteller}</span>
        </p>
        {step !== "setup" && (
          <p className="game-header-muted mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed">
            <span className="font-semibold text-amber-200/90">상황 카드</span>{" "}
            {diceSelection.blue?.icon} {diceSelection.blue?.label} · {diceSelection.red?.icon} {diceSelection.red?.label} · {diceSelection.yellow?.icon}{" "}
            {diceSelection.yellow?.label}
            {situation ? (
              <>
                {" "}
                → <span className="text-amber-50/95">「{situation}」</span>
              </>
            ) : null}
          </p>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
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
