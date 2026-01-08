export default function UploadCard() {
  return (
    <div className="lg:col-span-2 bg-cardDark rounded-xl p-6 border-l-4 border-neonCyan space-y-4 shadow-[0_0_7px_rgba(56,189,248,0.35),inset_4px_0_3px_rgba(56,189,248,0.25)]" >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Resume Analysis</h3>
        <span className="text-xs text-neonBlue border border-neonBlue/40 px-2 py-1 rounded">
          AI_MODEL_v4.2
        </span>
      </div>

      <div className="border border-dashed border-gray-600 rounded-lg p-8 text-center space-y-3">
        <div className="text-gray-400">
          Drop your resume here
        </div>
        <div className="text-xs text-gray-500">
          PDF, DOCX supported
        </div>
        <button className="bg-sky-500/7 text-neonCyan px-4 py-2 text-sm rounded hover:bg-neonCyan/10 transition">
          Browse Files
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" placeholder="Target Job Title" />
        <input className="input" placeholder="Industry / Role" />
      </div>
    </div>
  );
}
