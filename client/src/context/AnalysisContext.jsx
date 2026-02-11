import { createContext, useContext, useState } from "react";

const defaultContext = {
  analysisData: null,
  setAnalysisData: () => console.warn("setAnalysisData called outside Provider"),
  resetAnalysis: () => console.warn("resetAnalysis called outside Provider"), // <--- Added
  loading: false,
  setLoading: () => console.warn("setLoading called outside Provider"),
  error: null,
  setError: () => console.warn("setError called outside Provider"),
};

const AnalysisContext = createContext(defaultContext);

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New function to wipe data clean
  const resetAnalysis = () => {
    setAnalysisData(null);
    setError(null);
  };

  const value = {
    analysisData,
    setAnalysisData,
    resetAnalysis, // <--- Exposed here
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  try {
    const context = useContext(AnalysisContext);
    return context || defaultContext;
  } catch (err) {
    console.error("Error accessing AnalysisContext:", err);
    return defaultContext;
  }
}