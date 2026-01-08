import ScoreRing from "../ScoreRing";

export default function LiveScoreCard() {
  return (
    <div className="bg-cardDark rounded-xl border-r-4 border-neonPurple p-6 flex flex-col items-center justify-center shadow-[0_0_6px_rgba(168,85,247,0.35),inset_-4px_0_8px_rgba(168,85,247,0.25)]">
      <h3 className="mb-4 flex items-center gap-2">
        <span className="text-neonPurple">●</span> Live Score
      </h3>

      <ScoreRing score={89} />

      <p className="mt-4 text-sm text-gray-400">
        EXCELLENT
      </p>
    </div>
  );
}
