import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null); // null = checking, true = valid, false = invalid
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Validate token with backend
    const validateToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem("token");
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        // On network error, allow access but log the error
        // This prevents blank page if backend is down
        setIsValid(true);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) {
    // Show loading state while validating
    return (
      <div className="min-h-screen bg-bgDark flex items-center justify-center">
        <div className="text-neonCyan font-mono">Loading...</div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
}
