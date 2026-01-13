import UploadIcon from "../../assets/upload.svg";
import ResumeAnalysis from "../../assets/resume_analysis.svg";

export default function UploadCard() {
  return (
    <div className="lg:col-span-2 bg-cardDark rounded-xl p-6 border-l-4 border-neonCyan space-y-4 shadow-[0_0_10px_rgba(34,211,238,0.2),inset_4px_0_10px_1px_rgba(34,211,238,0.2)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={ResumeAnalysis} alt="Resume Analysis" />
          <h3 className="font-semibold text-[18px] font-sans">
            Resume Analysis
          </h3>
        </div>
        <span className="text-xs text-cyan-300 font-mono border border-neonCyan/30 px-2 py-1 rounded bg-[rgba(22,78,99,0.3)]">
          AI_MODEL_v4.2
        </span>
      </div>

      <div className="border-2 border-dashed border-[rgba(51,61,85,1)] rounded-lg p-8 text-center space-y-3 bg-cardDark/50">
        <div className="bg-[rgba(30,41,59,1)] rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <img src={UploadIcon} alt="Upload Icon" className="mx-auto" />
        </div>
        <div className="text-white">Drop your resume here</div>
        <div className="text-xs text-gray-500">PDF, DOCX supported</div>
        <button className="bg-sky-500/7 text-neonCyan px-4 py-2 text-sm rounded hover:bg-neonCyan/10 transition">
          Browse Files
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input font-mono" placeholder="Target Job Title" />
        <input className="input font-mono" placeholder="Industry / Role" />
      </div>
      <textarea
        className="input h-28 resize-none font-mono"
        placeholder="Paste Job Description here (skills, responsibilities, requirements)"
      />
    </div>
  );
}
