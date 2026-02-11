import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ScansPage from "./pages/ScansPage";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import { AnalysisProvider } from "./context/AnalysisContext";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AnalysisProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scans"
              element={
                <ProtectedRoute>
                  <ScansPage />
                </ProtectedRoute>
              }
            />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Routes>
        </BrowserRouter>
      </AnalysisProvider>
    </ErrorBoundary>
  );
}
