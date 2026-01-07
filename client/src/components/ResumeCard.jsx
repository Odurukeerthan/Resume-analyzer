import ScoreRing from "./ScoreRing";

export default function ResumeCard({ name, score }) {
  return (
    <div
      className="relative bg-cardDark rounded-xl border border-gray-700 
                 hover:border-neonBlue transition cursor-pointer overflow-hidden"
    >
      {/* Fake PDF Preview */}
      <div className="h-40 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
        PDF Preview
      </div>

      {/* Mini Score Ring */}
      <div className="absolute top-2 right-2 scale-50">
        <ScoreRing score={score} size={120} />
      </div>

      <div className="p-3 text-sm">
        {name}
      </div>
    </div>
  );
}
