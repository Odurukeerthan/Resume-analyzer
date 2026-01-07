export default function ResumeForm() {
  return (
    <form className="space-y-4">
      <input className="input" placeholder="Job Designation" />

      <textarea
        className="input h-32 resize-none"
        placeholder="Job Description"
      />

      <input
        type="file"
        accept=".pdf"
        className="text-sm text-gray-400"
      />

      <button className="btn-primary">
        Generate Score
      </button>
    </form>
  );
}
