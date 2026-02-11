import { FileText, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import { apiRequest } from "../../utils/api";

const getScoreStyle = (score) =>
  score >= 80
    ? "bg-green-500/10 text-green-400 border-green-400/30"
    : score >= 60
    ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/30"
    : "bg-red-500/10 text-red-400 border-red-400/30";

export default function RecentScans() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/resume/recent?limit=4");
        setScans(data.scans || []);
      } catch (error) {
        console.error("Error fetching recent scans:", error);
        setScans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScans();
  }, []);

  // Function to scroll to the top of the dashboard
  const handleUploadClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 relative mb-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Scans</h3>
        <Link
          to="/scans"
          className="text-sm text-neonCyan hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            Loading recent scans...
          </div>
        ) : scans.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No scans yet. Upload your first resume to get started!
          </div>
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id}
              className="relative bg-cardDark border border-cardStroke rounded-xl p-4
                         hover:border-neonCyan/40 transition group cursor-pointer"
            >
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

              <div className="block mt-4 font-medium truncate group-hover:text-neonCyan transition">
                {scan.name}
              </div>

              {scan.jobRole && (
                <p className="text-xs text-gray-500 mt-1 truncate">{scan.jobRole}</p>
              )}

              <p className="text-xs text-gray-400 mt-1">{scan.time}</p>
            </div>
          ))
        )}

        {/* UPLOAD NEW CARD */}
        <div
          onClick={handleUploadClick}
          className="flex items-center justify-center bg-cardDark border border-dashed
                     border-cardStroke rounded-xl cursor-pointer
                     hover:border-neonCyan/40 hover:bg-slate-800/30 transition h-full min-h-35"
        >
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 mx-auto flex items-center justify-center
                          rounded-full bg-gray-800 mb-2 group-hover:bg-gray-700">
              <Plus />
            </div>
            <span className="text-sm font-medium">Upload New</span>
          </div>
        </div>

      </div>
    </div>
  );
}