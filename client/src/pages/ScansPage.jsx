import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Download } from "lucide-react";
import { apiRequest } from "../utils/api";
import Header from "../components/header/Header";

const getScoreStyle = (score) =>
  score >= 80
    ? "bg-green-500/10 text-green-400 border-green-400/30"
    : score >= 60
    ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/30"
    : "bg-red-500/10 text-red-400 border-red-400/30";

export default function ScansPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllScans = async () => {
      try {
        // Reusing your existing endpoint with a high limit
        const data = await apiRequest("/resume/recent?limit=50");
        setScans(data.scans || []);
      } catch (error) {
        console.error("Error fetching scans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllScans();
  }, []);

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg bg-cardDark border border-cardStroke hover:border-neonCyan/50 transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Scan History</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading history...</div>
        ) : scans.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No scan history found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="bg-cardDark border border-cardStroke rounded-xl p-5 hover:border-neonCyan/40 transition group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <FileText className="text-slate-400" size={20} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getScoreStyle(scan.score)}`}>
                    {scan.score}/100
                  </span>
                </div>

                <h3 className="font-semibold text-white text-lg truncate mb-1 group-hover:text-neonCyan transition-colors">
                  {scan.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 truncate">
                  {scan.jobRole || "No Job Role Detected"}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {scan.time}
                  </div>
                  {/* Placeholder for future PDF download/view action */}
                  <button className="hover:text-white transition">
                     View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}