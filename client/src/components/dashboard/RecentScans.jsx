import { FileText, Plus } from "lucide-react";
import { useState } from "react";

/* DUMMY DATA (replace later with API) */
const scans = [
  {
    id: 1,
    name: "Software_Eng_V2.pdf",
    score: 88,
    time: "Scanned 2 hours ago",
    url: "/dummy/Software_Eng_V2.pdf",
  },
  {
    id: 2,
    name: "Frontend_Dev_Final.pdf",
    score: 72,
    time: "Scanned yesterday",
    url: "/dummy/Frontend_Dev_Final.pdf",
  },
  {
    id: 3,
    name: "Resume_Draft_1.docx",
    score: 45,
    time: "Scanned 3 days ago",
    url: "/dummy/Resume_Draft_1.docx",
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
  const [previewUrl, setPreviewUrl] = useState(null);

  return (
    <div className="space-y-4 relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Scans</h3>
        <a
          href="/scans"
          className="text-sm text-neonCyan hover:underline"
        >
          View All →
        </a>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {scans.map((scan) => (
          <div
            key={scan.id}
            onMouseEnter={() => setPreviewUrl(scan.url)}
            onMouseLeave={() => setPreviewUrl(null)}
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
              href={scan.url}
              target="_blank"
              rel="noreferrer"
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

      {/* HOVER PREVIEW */}
      {previewUrl && (
        <div className="fixed right-6 bottom-6 z-50 w-48 h-64
                        bg-black border border-cardStroke rounded-lg
                        overflow-hidden shadow-xl">
          <iframe
            src={previewUrl}
            title="Preview"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
