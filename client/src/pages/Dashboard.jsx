import UploadCard from "../components/dashboard/UploadCard";
import LiveScoreCard from "../components/dashboard/LiveScoreCard";
import Header from "../components/header/Header.jsx";
import SkillSpiderCard from "../components/dashboard/SkillSpiderCard.jsx";
import ScoreHistoryCard from "../components/dashboard/ScoreHistoryCard.jsx";

export default function Dashboard() {
  return (
    /* Change 1: Ensure flex-col and h-full logic is correct */
    <div className="min-h-screen w-full bg-bgDark text-gray-200 flex flex-col">
      <Header />

      {/* Change 2: Ensure main is a flex-grow child so it pushes the footer/bottom */}
      <main className="grow p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:mx-10 lg:mx-15 xl:mx-25 2xl:mx-32">
          <UploadCard />
          <LiveScoreCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch w-full gap-4">
          <SkillSpiderCard />
          <ScoreHistoryCard />
        </div>
      </main>
    </div>
  );
}
