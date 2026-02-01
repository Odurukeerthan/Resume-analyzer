import ScoreRing from "../ScoreRing";
import LiveScore from "../../assets/live-score.svg";
import { useAnalysis } from "../../context/AnalysisContext";

export default function LiveScoreCard() {
  const analysisContext = useAnalysis();
  const analysisData = analysisContext?.analysisData || null;
  const loading = analysisContext?.loading || false;

  const overallScore = analysisData?.analysis?.live_scores?.overall || 
                       analysisData?.analysis?.finalScore || 0;
  const keywordsScore = analysisData?.analysis?.live_scores?.keywords || 0;
  const formattingScore = analysisData?.analysis?.live_scores?.formatting || 0;

  const getScoreLabel = (score) => {
    if (score >= 80) return "EXCELLENT";
    if (score >= 60) return "GOOD";
    if (score >= 40) return "FAIR";
    return "NEEDS WORK";
  };

  if (!analysisData && !loading) {
    return (
      <div className="bg-cardDark rounded-xl border-r-4 border-neonPurple p-6 flex flex-col shadow-[0_0_10px_rgba(192,132,252,0.2),inset_-4px_0_5px_1px_rgba(192,132,252,0.1)] h-full">
        <div className="flex items-center gap-2 w-full mb-2">
          <img src={LiveScore} alt="Live Score" className="w-6 h-6" />
          <h3 className="font-sans text-[18px] font-semibold">Live Score</h3>
        </div>
        <div className="flex flex-col items-center justify-center grow w-full py-4">
          <p className="text-gray-500 text-sm font-mono">Upload a resume to see your score</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cardDark rounded-xl border-r-4 border-neonPurple p-6 flex flex-col shadow-[0_0_10px_rgba(192,132,252,0.2),inset_-4px_0_5px_1px_rgba(192,132,252,0.1)] h-full">
      <div className="flex items-center gap-2 w-full mb-2">
        <img src={LiveScore} alt="Live Score" className="w-6 h-6" />
        <h3 className="font-sans text-[18px] font-semibold">Live Score</h3>
      </div>

      <div className="flex flex-col items-center justify-center grow w-full py-4">
        <ScoreRing score={Math.round(overallScore)} />

        <p className="mt-4 text-sm text-gray-400 font-mono">
          {getScoreLabel(overallScore)}
        </p>
      </div>
      {/* METRICS */}
      <div className="w-full mt-4 space-y-3 text-sm">
        {/* KEYWORDS */}
        <div className="flex items-center gap-1">
          <span className="w-24 text-gray-400">Keywords</span>
          <div className="flex items-center gap-3 w-1/4 ml-auto"></div>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400"
              style={{ width: `${keywordsScore}%` }}
            />
          </div>
          <span className="w-7 text-right text-gray-300 font-mono">
            {keywordsScore}%
          </span>
        </div>
        <div />

        {/* FORMATTING */}
        <div className="flex items-center gap-1">
          <span className="w-24 text-gray-400">Formatting</span>
          <div className="flex items-center gap-3 w-1/4 ml-auto"></div>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400"
              style={{ width: `${formattingScore}%` }}
            />
          </div>
          <span className="w-7 text-right text-gray-300 font-mono">
            {formattingScore}%
          </span>
        </div>
        <div />
      </div>
    </div>
  );
}
