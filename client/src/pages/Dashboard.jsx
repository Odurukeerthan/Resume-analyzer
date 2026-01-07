import ResumeForm from "../components/ResumeForm";
import ScoreRing from "../components/ScoreRing";
import ResumeCard from "../components/ResumeCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bgDark text-gray-200 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-neonBlue">
        Resume Analyzer Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-cardDark p-6 rounded-xl border border-neonBlue/20">
          <ResumeForm />
        </div>

        {/* Score */}
        <div className="bg-cardDark p-6 rounded-xl border border-neonPurple/20 flex items-center justify-center">
          <ScoreRing score={25} />
        </div>
      </div>

      {/* History */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">Previous Uploads</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResumeCard name="Resume_2024.pdf" score={50} />
          <ResumeCard name="Internship.pdf" score={74} />
        </div>
      </div>
    </div>
  );
}
