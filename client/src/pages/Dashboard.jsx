import Sidebar from "../components/layout/Sidebar";
import UploadCard from "../components/dashboard/UploadCard";
import LiveScoreCard from "../components/dashboard/LiveScoreCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bgDark flex text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-xs text-green-400 mt-1 font-mono">
              <span className="text-gray-500 font-mono font-bold">SYSTEM_STATUS:</span> ONLINE
            </p>
          </div>

          <button className="btn-primary px-2 py-2 text-sm w-fit shadow-cyan-500/10">+ New Scan</button>

        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UploadCard />
          <LiveScoreCard />
        </div>
      </main>
    </div>
  );
}
