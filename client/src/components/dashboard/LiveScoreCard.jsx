import ScoreRing from "../ScoreRing";
import LiveScore from "../../assets/live-score.svg";
export default function LiveScoreCard() {
  return (
    <div className="bg-cardDark rounded-xl border-r-4 border-neonPurple p-6 flex flex-col shadow-[0_0_10px_rgba(192,132,252,0.2),inset_-4px_0_5px_1px_rgba(192,132,252,0.1)] h-full">
      <div className="flex items-center gap-2 w-full mb-2">
        <img src={LiveScore} alt="Live Score" className="w-6 h-6" />
        <h3 className="font-sans text-[18px] font-semibold">Live Score</h3>
      </div>

      <div className="flex flex-col items-center justify-center grow w-full py-4">
        <ScoreRing score={89} />

        <p className="mt-4 text-sm text-gray-400 font-mono">EXCELLENT</p>
      </div>
      {/* METRICS */}
      <div className="w-full mt-4 space-y-3 text-sm">
        {/* KEYWORDS */}
        <div className="flex items-center gap-3">
          <span className="w-24 text-gray-400">Keywords</span>
          <div className="flex items-center gap-3 w-1/4 ml-auto"></div>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-400" style={{ width: "90%" }} />
          </div>
          <span className="w-10 text-right text-gray-300">90%</span>
        </div>
        <div />

        {/* FORMATTING */}
        <div className="flex items-center gap-3">
          <span className="w-24 text-gray-400">Formatting</span>
          <div className="flex items-center gap-3 w-1/4 ml-auto"></div>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full w-2 bg-yellow-400"
              style={{ width: "75%" }}
            />
          </div>
          <span className="w-10 text-right text-gray-300">75%</span>
        </div>
        <div />
      </div>
    </div>
  );
}
