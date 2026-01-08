import { useEffect, useState } from "react";

function getScoreColor(score) {
  if (score <= 25) return "#ef4444"; // red
  if (score <= 40) return "#f97316"; // orange
  if (score <= 55) return "#eab308"; // yellow
  if (score <= 70) return "#22c55e"; // green
  if (score <= 85) return "#38bdf8"; // blue
  return "#a855f7"; // violet
}

export default function ScoreRing({ score, size = 160 }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progress = ((100 - score) / 100) * circumference;
    setOffset(progress);
  }, [score]);

  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-1000"
        />
      </svg>

      <div
        className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
        style={{ color }}
      >
        {score}%
      </div>
    </div>
  );
}
