import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify/${token}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setStatus("success");
        setMessage("Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center text-white">
      <div className="bg-cardDark border border-cardStroke rounded-xl p-8 text-center max-w-md">
        {status === "verifying" && <p>Verifying your email…</p>}
        {status === "success" && <p className="text-green-400">{message}</p>}
        {status === "error" && <p className="text-red-400">{message}</p>}
      </div>
    </div>
  );
}
