import { useState, useRef } from "react";
import UploadIcon from "../../assets/upload.svg";
import ResumeAnalysis from "../../assets/resume_analysis.svg";
import { useAnalysis } from "../../context/AnalysisContext";
import { apiRequest } from "../../utils/api";

export default function UploadCard() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const analysisContext = useAnalysis();
  const setAnalysisData = analysisContext?.setAnalysisData || (() => {});
  const resetAnalysis = analysisContext?.resetAnalysis || (() => {}); // <--- Import this
  const setLoading = analysisContext?.setLoading || (() => {});
  const setError = analysisContext?.setError || (() => {});
  const error = analysisContext?.error || null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a resume file");
      return;
    }

    // --- KEY FIX STARTS HERE ---
    resetAnalysis(); // 1. Wipe the old score/suggestions immediately
    setUploading(true);
    setLoading(true); // 2. Trigger loading state in UI
    setError(null);
    // ---------------------------

    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");
      const uploadRes = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const uploadData = await uploadRes.json();

      // Step 2: Analyze resume
      const analysisRes = await apiRequest("/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumePath: uploadData.resume.absolutePath,
          resumeId: uploadData.resume._id,
          jobRole: jobTitle || jobRole || "Software Developer",
          jobDescription: jobDescription || "",
        }),
      });

      setAnalysisData({
        ...analysisRes,
        resumeId: uploadData.resume._id,
        jobRole: jobTitle || jobRole || "Software Developer",
        jobDescription: jobDescription || "",
      });
      setError(null);

      // Reset form
      setFile(null);
      setJobTitle("");
      setJobRole("");
      setJobDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message || "Analysis failed");
      setAnalysisData(null);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 bg-cardDark rounded-xl p-6 border-l-4 border-neonCyan space-y-4 shadow-[0_0_10px_rgba(34,211,238,0.2),inset_4px_0_10px_1px_rgba(34,211,238,0.2)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={ResumeAnalysis} alt="Resume Analysis" />
          <h3 className="font-semibold text-[18px] font-sans">
            Resume Analysis
          </h3>
        </div>
        <span className="text-xs text-cyan-300 font-mono border border-neonCyan/30 px-2 py-1 rounded bg-[rgba(22,78,99,0.3)]">
          AI_MODEL_v4.2
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="border-2 border-dashed border-[rgba(51,61,85,1)] rounded-lg p-8 text-center space-y-3 bg-cardDark/50 cursor-pointer hover:border-neonCyan/50 transition"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="bg-[rgba(30,41,59,1)] rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <img src={UploadIcon} alt="Upload Icon" className="mx-auto" />
          </div>
          {file ? (
            <div className="text-white">
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <>
              <div className="text-white">Drop your resume here</div>
              <div className="text-xs text-gray-500">PDF supported</div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            className="bg-sky-500/7 text-neonCyan px-4 py-2 text-sm rounded hover:bg-neonCyan/10 transition"
          >
            {file ? "Change File" : "Browse Files"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input font-mono"
            placeholder="Target Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            className="input font-mono"
            placeholder="Industry / Role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
        </div>
        <textarea
          className="input h-28 resize-none font-mono"
          placeholder="Paste Job Description here (skills, responsibilities, requirements)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && (
          <div className="text-red-400 text-sm font-mono">{error}</div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all bg-neonCyan text-black ${
            uploading || !file
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-neonCyan/80"
          }`}
        >
          {uploading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>
    </div>
  );
}