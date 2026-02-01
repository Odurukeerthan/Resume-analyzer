import { createContext, useContext, useState } from "react";

const defaultContext = {
  analysisData: null,
  setAnalysisData: () => {
    console.warn("setAnalysisData called outside AnalysisProvider");
  },
  loading: false,
  setLoading: () => {
    console.warn("setLoading called outside AnalysisProvider");
  },
  error: null,
  setError: () => {
    console.warn("setError called outside AnalysisProvider");
  },
};

const AnalysisContext = createContext(defaultContext);

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    analysisData,
    setAnalysisData,
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
    // Ensure we always return a valid context object
    return context || defaultContext;
  } catch (err) {
    console.error("Error accessing AnalysisContext:", err);
    return defaultContext;
  }
}
