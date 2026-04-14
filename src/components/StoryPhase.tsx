import { useGameStore } from "../store/gameStore";

export function StoryPhase() {
  const situation = useGameStore((s) => s.situation);
  const setSituation = useGameStore((s) => s.setSituation);
  const completeStoryStep = useGameStore((s) => s.completeStoryStep);
  const canNext = situation.trim().length > 0 && situation.length <= 150;

  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">이야기 만들기 (최대 150자)</h2>
      <textarea
        className="h-40 w-full rounded-lg border p-3"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="3문장 이내로 위기 상황을 입력하세요."
      />
      <p className="text-sm text-slate-600">글자 수: {situation.length} / 150</p>
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-40" disabled={!canNext} onClick={completeStoryStep}>
        다음
      </button>
    </section>
  );
}
