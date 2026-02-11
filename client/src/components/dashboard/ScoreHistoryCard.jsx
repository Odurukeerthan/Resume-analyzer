import { useState, useEffect } from "react";
import ScoreHistoryIcon from "../../assets/score-hist.svg"; 
import { apiRequest } from "../../utils/api";

export default function ScoreHistoryCard() {
  const [scores, setScores] = useState([]);
  const [labels, setLabels] = useState([]); // Formerly 'months'
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiRequest("/resume/history");
        
        if (data && data.length > 0) {
          // Extract scores
          setScores(data.map(item => item.score));
          
          // Extract and format dates (e.g., "Feb 10")
          setLabels(data.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }));
        } else {
          // Fallback if no data exists yet
          setScores([0]);
          setLabels(["Now"]);
        }
      } catch (error) {
        console.error("Failed to load score history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // --- Graph Configuration ---
  const width = 420;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const maxScore = 100;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  
  // Calculate X-step (Prevent division by zero if only 1 point)
  const stepX = scores.length > 1 ? chartWidth / (scores.length - 1) : 0;

  // Coordinate Helper
  const getCoordinates = (score, index) => {
    const x = paddingX + index * stepX;
    const y = paddingY + (1 - score / maxScore) * chartHeight;
    return { x, y };
  };

  const points = scores.map((score, i) => getCoordinates(score, i));

  // Generate Path Strings
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : "";

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : "";

  if (loading) return <div className="p-6 text-slate-400">Loading history...</div>;

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 w-full h-full text-white shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <img src={ScoreHistoryIcon} alt="ScoreHistory" className="w-6 h-6" />
        <h3 className="font-sans text-[18px] font-semibold">Score History</h3>
      </div>

      {scores.length > 0 && scores[0] !== 0 ? (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: "visible", paddingBottom: "15px" }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-AXIS GRID LINES */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = paddingY + (1 - val / maxScore) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 12}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="end"
                  className="font-medium"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* AREA FILL */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* LINE */}
          <path
            d={linePath}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DATA POINTS */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#0f172a"
              stroke="#22d3ee"
              strokeWidth="2"
            />
          ))}

          {/* X-AXIS LABELS */}
          {labels.map((label, i) => {
            const x = paddingX + i * stepX;
            return (
              <text
                key={i}
                x={x}
                y={height - 2}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="middle"
                className="font-medium"
              >
                {label}
              </text>
            );
          })}
        </svg>
      ) : (
        <div className="flex h-37.5 flex-col items-center justify-center text-slate-500 gap-2">
           <p>No score history available yet.</p>
           <p className="text-sm">Upload a resume to see your progress!</p>
        </div>
      )}
    </div>
  );
}