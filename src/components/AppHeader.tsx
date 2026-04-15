import { TOTAL_GAME_ROUNDS, useGameStore } from "../store/gameStore";
import { useRoomStore } from "../store/roomStore";

type Props = {
  /** setup 단계는 밝은 헤더, 그 외는 기존 다크 헤더 */
  variant: "light" | "dark";
};

export function AppHeader({ variant }: Props) {
  const step = useGameStore((s) => s.step);
  const currentRound = useGameStore((s) => s.currentRound);
  const players = useGameStore((s) => s.players);
  const storytellerId = useGameStore((s) => s.storytellerId);
  const diceSelection = useGameStore((s) => s.diceSelection);
  const situation = useGameStore((s) => s.situation);
  const storyteller = players.find((p) => p.id === storytellerId)?.name ?? storytellerId;

  const kind = useRoomStore((s) => s.kind);
  const roomCode = useRoomStore((s) => s.roomCode);
  const leaveToPortal = useRoomStore((s) => s.leaveToPortal);

  const handleLeave = () => {
    useGameStore.getState().resetGame();
    leaveToPortal();
  };

  const copyCode = () => {
    if (roomCode) void navigator.clipboard.writeText(roomCode);
  };

  const isDark = variant === "dark";

  return (
    <header
      className={
        isDark
          ? "game-header sticky top-0 z-10 mb-5 p-4 md:mb-6 md:p-5"
          : "sticky top-0 z-10 mb-5 rounded-2xl border-2 border-stone-200 bg-white/95 p-4 shadow-sm md:mb-6 md:p-5"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 min-w-0 shrink">
          <img
            src="/logo-question-hero.png"
            alt="질문 히어로"
            width={560}
            height={240}
            decoding="async"
            className={
              isDark
                ? "h-[4.25rem] w-auto max-w-[min(100%,320px)] object-contain object-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:h-[5.5rem] md:max-w-[min(100%,400px)]"
                : "h-[5.25rem] w-auto max-w-[min(100%,380px)] object-contain object-left md:h-[6.75rem] md:max-w-[min(100%,460px)]"
            }
          />
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {kind === "online" && roomCode ? (
            <button
              type="button"
              onClick={() => void copyCode()}
              className={
                isDark
                  ? "rounded-full border border-amber-400/50 bg-black/25 px-3 py-1 text-xs font-bold text-amber-100"
                  : "rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900"
              }
            >
              방 {roomCode} · 복사
            </button>
          ) : null}
          {kind === "local" ? (
            <span className={isDark ? "text-xs font-bold text-amber-100/90" : "text-xs font-bold text-stone-600"}>오프라인 연습</span>
          ) : null}
          {kind !== "portal" ? (
            <button
              type="button"
              onClick={handleLeave}
              className={
                isDark
                  ? "rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-amber-50 hover:bg-white/15"
                  : "rounded-lg border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-800 hover:bg-stone-200"
              }
            >
              처음으로
            </button>
          ) : null}
          <span
            className={
              isDark
                ? "rounded-full border border-amber-400/40 bg-black/20 px-3 py-1 text-xs font-bold text-amber-100/95"
                : "rounded-full border border-amber-400/60 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-950"
            }
          >
            라운드 {currentRound}/{TOTAL_GAME_ROUNDS}
          </span>
        </div>
      </div>
      <p className={`mt-2 text-sm font-semibold ${isDark ? "text-amber-50/95" : "text-stone-800"}`}>
        스토리텔러: <span className={isDark ? "text-white" : "text-blue-900"}>{storyteller}</span>
      </p>
      {step !== "setup" && (
        <p
          className={`mt-3 border-t pt-3 text-xs leading-relaxed ${isDark ? "game-header-muted border-white/10" : "border-stone-200 text-stone-600"}`}
        >
          <span className={`font-semibold ${isDark ? "text-amber-200/90" : "text-amber-800"}`}>상황 카드</span>{" "}
          {diceSelection.blue?.icon} {diceSelection.blue?.label} · {diceSelection.red?.icon} {diceSelection.red?.label} · {diceSelection.yellow?.icon}{" "}
          {diceSelection.yellow?.label}
          {situation ? (
            <>
              {" "}
              → <span className={isDark ? "text-amber-50/95" : "text-stone-800"}>「{situation}」</span>
            </>
          ) : null}
        </p>
      )}
    </header>
  );
}
