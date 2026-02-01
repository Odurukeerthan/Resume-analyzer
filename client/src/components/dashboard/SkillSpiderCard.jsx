import SkillGapAnalysis from "../../assets/skill-gap.svg";
import { useAnalysis } from "../../context/AnalysisContext";

export default function SkillSpiderCard() {
  const analysisContext = useAnalysis();
  const analysisData = analysisContext?.analysisData || null;
  
  // Skills matching spider metrics: coding, design, experience, problem_solving, communication, leadership
  const skills = ["Coding", "Design", "Experience", "Problem Solving", "Communication", "Leadership"];
  const cx = 100;
  const cy = 100;
  const outerRadius = 80;

  // Extract spider metrics from analysis
  const resumeSpider = analysisData?.analysis?.spider?.resume || {};
  const jobSpider = analysisData?.analysis?.spider?.job || {};

  // Map spider metrics to chart values (already 0-100 from Python)
  const getResumeValues = () => {
    if (!analysisData) return [0, 0, 0, 0, 0, 0];
    
    return [
      resumeSpider.coding || 0,
      resumeSpider.design || 0,
      resumeSpider.experience || 0,
      resumeSpider.problem_solving || 0,
      resumeSpider.communication || 0,
      resumeSpider.leadership || 0,
    ];
  };

  const getJobValues = () => {
    if (!analysisData) return [0, 0, 0, 0, 0, 0];
    
    return [
      jobSpider.coding || 80,
      jobSpider.design || 80,
      jobSpider.experience || 80,
      jobSpider.problem_solving || 80,
      jobSpider.communication || 80,
      jobSpider.leadership || 80,
    ];
  };

  const resumeValues = getResumeValues();
  const jobValues = getJobValues();

  // Convert to radius values (0-80)
  const resumeRadii = resumeValues.map(v => (v / 100) * outerRadius);
  const jobRadii = jobValues.map(v => (v / 100) * outerRadius);

  if (!analysisData) {
    return (
      <div className="bg-cardDark border border-cardStroke rounded-xl p-6 w-full h-full">
        <div className="flex items-center gap-2 mb-6">
          <img src={SkillGapAnalysis} alt="Skill Gap Analysis" className="w-6 h-6" />
          <h3 className="font-sans text-[18px] font-semibold">Skill gap analysis</h3>
        </div>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm font-mono">Upload a resume to see skill gap analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cardDark border border-cardStroke rounded-xl p-6 w-full h-full">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-2 mb-6">
        <img src={SkillGapAnalysis} alt="Skill Gap Analysis" className="w-6 h-6" />
        <h3 className="font-sans text-[18px] font-semibold">Skill gap analysis</h3>
      </div>

      {/* LEGEND */}
      <div className="flex items-center gap-4 mb-4 uppercase tracking-wider font-mono">
        <span className="flex items-center gap-1.5 text-neonCyan">
          <span className="w-5 h-3 border border-neonCyan bg-neonCyan/20" />
          Your Profile
        </span>
        <span className="flex items-center gap-1.5 text-neonPurple">
          <span className="w-5 h-3 border border-neonPurple bg-neonPurple/20" />
          Job Requirement
        </span>
      </div>

      {/* CHART AREA */}
      <div className="flex justify-center items-center">
        <svg viewBox="0 0 240 240" width="100%" height="240" className="overflow-visible">
          {/* Shift everything to center of the 240x240 viewbox */}
          <g transform="translate(20, 20)">
            {/* GRID HEXAGONS */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((factor) => (
              <polygon
                key={factor}
                points={polygonPoints(cx, cy, outerRadius * factor, 6)}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}

            {/* AXES & LABELS */}
            {skills.map((skill, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              const x2 = cx + outerRadius * Math.cos(angle);
              const y2 = cy + outerRadius * Math.sin(angle);
              const labelX = cx + (outerRadius + 20) * Math.cos(angle);
              const labelY = cy + (outerRadius + 15) * Math.sin(angle);

              return (
                <g key={i}>
                  <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" />
                  <text
                    x={labelX}
                    y={labelY}
                    fill="#9ca3af"
                    fontSize="10"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="font-sans"
                  >
                    {skill}
                  </text>
                </g>
              );
            })}

            {/* JOB REQUIREMENT (Purple) */}
            <polygon
              points={polygonPoints(cx, cy, jobRadii)}
              fill="rgba(168,85,247,0.2)"
              stroke="#a855f7"
              strokeWidth="2"
            />

            {/* YOUR PROFILE (Cyan) */}
            <polygon
              points={polygonPoints(cx, cy, resumeRadii)}
              fill="rgba(34,211,238,0.2)"
              stroke="#22d3ee"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Fixed Polygon Helper to handle array of values correctly
function polygonPoints(cx, cy, r, sides = 6) {
  const points = Array.isArray(r) ? r : Array(sides).fill(r);
  return points
    .map((val, i) => {
      const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2;
      return `${cx + val * Math.cos(angle)},${cy + val * Math.sin(angle)}`;
    })
    .join(" ");
}