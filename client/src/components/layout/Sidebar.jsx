export default function Sidebar() {
  return (
    <aside className="w-64 bg-cardDark border-r border-gray-800 p-4 flex flex-col">
      <h2 className="text-xl font-bold text-neonBlue mb-8">
        RESUME.AI
      </h2>

      <nav className="space-y-2 text-sm">
        <div className="p-2 rounded bg-bgDark text-neonBlue">
          Dashboard
        </div>
        <div className="p-2 rounded text-gray-400 hover:text-neonBlue cursor-pointer">
          Upload Resume
        </div>
        <div className="p-2 rounded text-gray-400 hover:text-neonBlue cursor-pointer">
          Scan History
        </div>
      </nav>

      <div className="mt-auto text-xs text-gray-400">
        Pro Member
      </div>
    </aside>
  );
}
