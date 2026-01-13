import UploadCard from "../components/dashboard/UploadCard";
import LiveScoreCard from "../components/dashboard/LiveScoreCard";
import Header from "../components/header/Header.jsx"
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bgDark text-gray-200">

      {/* HEADER */}
      <Header/>
      {/* MAIN CONTENT */}
      <main className="p-6 space-y-6 md:mx-20 lg:mx-15 xl:mx-25 2xl:mx-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UploadCard />
          <LiveScoreCard />
        </div>
      </main>

    </div>
  );
}
