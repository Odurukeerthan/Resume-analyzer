import ResumeAI from "../../assets/resume_ai.svg";

export default function Header() {
  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4
                       bg-bgDark border-b border-cardStroke"
    >
      {/* LEFT: LOGO */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <img
            src={ResumeAI}
            alt="Resume AI"
            className="w-8 h-8 bg-neonCyan p-1.5 rounded-md
                     shadow-[0_0_10px_rgba(34,211,238,0.6)]"
          />
          <h1 className="text-lg font-bold text-neonBlue">
            <span className="text-white">RESUME</span>.AI
          </h1>
        </div>
        <p className="text-xs text-green-400 font-mono mt-1">
          <span className="text-gray-500 font-bold">SYSTEM_STATUS:</span> ONLINE
        </p>
      </div>

      {/* RIGHT: USER */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-neonBlue/20
                        flex items-center justify-center text-neonBlue"
        >
          K
        </div>
        <div className="text-right text-sm">
          <p className="text-gray-300">Keerthan</p>
          <p className="text-xs text-gray-500">Pro</p>
        </div>
      </div>
    </header>
  );
}
