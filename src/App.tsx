import { useLayoutEffect } from "react";
import { AppHeader } from "./components/AppHeader";
import { DicePhase } from "./components/DicePhase";
import { GameEndPhase } from "./components/GameEndPhase";
import { OnlinePortal } from "./components/OnlinePortal";
import { QuestionPhase } from "./components/QuestionPhase";
import { RoundEndPhase } from "./components/RoundEndPhase";
import { Scoreboard } from "./components/Scoreboard";
import { SetupScreen } from "./components/SetupScreen";
import { StoryPhase } from "./components/StoryPhase";
import { VotingPhase } from "./components/VotingPhase";
import { useGameRoomSync } from "./hooks/useGameRoomSync";
import { useGameStore } from "./store/gameStore";
import { useRoomStore } from "./store/roomStore";

function App() {
  const kind = useRoomStore((s) => s.kind);
  const roomCode = useRoomStore((s) => s.roomCode);
  const step = useGameStore((s) => s.step);

  useLayoutEffect(() => {
    useRoomStore.getState().restoreFromSession();
  }, []);

  useGameRoomSync(kind === "online" ? roomCode : null, kind);

  if (kind === "portal") {
    return <OnlinePortal />;
  }

  const lightShell = step === "setup";

  return (
    <div className={lightShell ? "min-h-screen bg-white text-[var(--game-ink)]" : "min-h-screen"}>
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-4 md:px-6 md:pb-14 md:pt-6">
        <AppHeader variant={lightShell ? "light" : "dark"} />

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
    </div>
  );
}

export default App;
