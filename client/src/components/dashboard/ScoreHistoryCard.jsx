import ScoreHistory from '../../assets/score-hist.svg';

export default function ScoreHistoryCard() {
  const scores = [65, 70, 72, 68, 80, 85];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const width = 420;
  const height = 180; 
  const paddingX = 40;
  const paddingY = 25; // Top and bottom spacing for labels

  const maxScore = 100;
  
  // Clean Drawing Constants
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - (paddingY * 2); 
  const stepX = chartWidth / (scores.length - 1);

  // Unified Coordinate Helper
  const getCoordinates = (score, index) => {
    const x = paddingX + index * stepX;
    const y = paddingY + (1 - score / maxScore) * chartHeight;
    return { x, y };
  };

  const points = scores.map((score, i) => getCoordinates(score, i));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath =
    `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 w-full h-full text-white shadow-xl">
      <div className="flex items-center gap-2 mb-6">
              <img src={ScoreHistory} alt="ScoreHistory" className="w-6 h-6" />
              <h3 className="font-sans text-[18px] font-semibold">Score History</h3>
        </div>

      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible', paddingBottom: '15px' }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-AXIS GRID (SOLID LINES) */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = paddingY + (1 - val / maxScore) * chartHeight;
          return (
            <g key={val}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.08)" // Solid, subtle line
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

        {/* AREA */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* DATA LINE */}
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
        {months.map((m, i) => {
          const x = paddingX + i * stepX;
          return (
            <text
              key={m}
              x={x}
              y={height - 2}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              className="font-medium"
            >
              {m}
            </text>
          );
        })}
      </svg>
    </div>
  );
}