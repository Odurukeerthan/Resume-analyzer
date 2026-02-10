import { useState } from "react";
import { apiRequest } from "../../utils/api";
import { useAnalysis } from "../../context/AnalysisContext";

export default function AISuggestionsCard() {
  const { analysisData, setAnalysisData } = useAnalysis();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetSuggestions = async () => {
    if (!analysisData?.resumeId || !analysisData?.analysis) {
      setError("Analysis data not available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/ai/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId: analysisData.resumeId,
          jobRole: analysisData.jobRole || "Software Developer",
          jobDescription: analysisData.jobDescription || "",
          analysis: analysisData.analysis,
        }),
      });

      setSuggestions(response.suggestions);
      
      // Update context with suggestions
      if (setAnalysisData) {
        setAnalysisData({
          ...analysisData,
          suggestions: response.suggestions,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to get AI suggestions");
      setSuggestions(null);
    } finally {
      setLoading(false);
    }
  };

  // Show button only if analysis is available
  if (!analysisData?.analysis) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      {/* AI Suggestions Button */}
      <button
        onClick={handleGetSuggestions}
        disabled={loading || suggestions}
        className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
          loading || suggestions
            ? "opacity-60 cursor-not-allowed bg-gray-600"
            : "bg-neonPurple text-white hover:bg-neonPurple/80"
        }`}
      >
        {loading
          ? "Generating Suggestions..."
          : suggestions
          ? "Suggestions Generated"
          : "Get AI Suggestions"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/30 rounded p-2">
          {error}
        </div>
      )}

      {/* Suggestions Card */}
      {suggestions && (
        <div className="bg-cardDark border border-cardStroke rounded-xl p-4 max-h-64 overflow-y-auto">
          <h4 className="text-sm font-semibold text-neonPurple mb-3">
            AI Improvement Suggestions
          </h4>
          <div className="text-sm text-gray-300 whitespace-pre-wrap">
            {suggestions}
          </div>
        </div>
      )}
    </div>
  );
}
