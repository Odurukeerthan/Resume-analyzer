import { FileText, Plus } from "lucide-react";

/* DUMMY DATA (replace later with API) */
const scans = [
  {
    id: 1,
    name: "Software_Eng_V2.pdf",
    score: 88,
    time: "Scanned 2 hours ago",
  },
  {
    id: 2,
    name: "Frontend_Dev_Final.pdf",
    score: 72,
    time: "Scanned yesterday",
  },
  {
    id: 3,
    name: "Resume_Draft_1.docx",
    score: 45,
    time: "Scanned 3 days ago",
  },
];

/* SAME LOGIC AS LIVE SCORE */
const getScoreStyle = (score) =>
  score >= 80
    ? "bg-green-500/10 text-green-400 border-green-400/30"
    : score >= 60
    ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/30"
    : "bg-red-500/10 text-red-400 border-red-400/30";

export default function RecentScans() {
  return (
    <div className="space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Scans</h3>
        <button className="text-sm text-neonCyan hover:underline flex items-center gap-1">
          View All →
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {scans.map((scan) => (
          <div
            key={scan.id}
            className="relative bg-cardDark border border-cardStroke rounded-xl p-4
                       hover:border-neonCyan/40 transition group"
          >
            {/* TOP ROW */}
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-800">
                <FileText size={18} className="text-gray-400" />
              </div>

              <span
                className={`text-xs px-2 py-0.5 rounded border ${getScoreStyle(
                  scan.score
                )}`}
              >
                {scan.score}/100
              </span>
            </div>

            {/* FILE NAME */}
            <a
              href="#"
              className="block mt-4 font-medium truncate
                         group-hover:text-neonCyan transition"
            >
              {scan.name}
            </a>

            {/* TIME */}
            <p className="text-xs text-gray-400 mt-1">{scan.time}</p>
          </div>
        ))}

        {/* UPLOAD NEW CARD */}
        <div
          className="flex items-center justify-center bg-cardDark border border-dashed
                     border-cardStroke rounded-xl cursor-pointer
                     hover:border-neonCyan/40 transition"
        >
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 mx-auto flex items-center justify-center
                            rounded-full bg-gray-800 mb-2">
              <Plus />
            </div>
            Upload New
          </div>
        </div>

      </div>
    </div>
  );
}
