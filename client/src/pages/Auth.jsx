import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import { registerSchema, loginSchema } from "../validation/auth.schema.js";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔍 ZOD VALIDATION (INSERT HERE)
    const result = isLogin
      ? loginSchema.safeParse({
          email: form.email,
          password: form.password,
        })
      : registerSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return; // ⛔ stop submission
    }

    setLoading(true);

    try {
      const data = isLogin
        ? await loginUser({
            email: form.email,
            password: form.password,
          })
        : await registerUser({
            name: form.name,
            email: form.email,
            password: form.password,
          });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center relative overflow-hidden font-sans">
      {/* GLOW BACKGROUND */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-neonBlue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neonPurple/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          {/* TOGGLE */}
          <div className="flex bg-black/40 p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? "bg-neonBlue text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                  : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? "bg-neonPurple text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-gray-400 text-center text-sm mb-8">
            {isLogin
              ? "Enter your credentials to access your dashboard"
              : "Sign up to start analyzing your resume"}
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-white/5 border-b border-white/10 py-3 px-1 text-white focus:outline-none focus:border-neonPurple"
              />
            )}

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full bg-white/5 border-b border-white/10 py-3 px-1 text-white focus:outline-none ${
                isLogin ? "focus:border-neonBlue" : "focus:border-neonPurple"
              }`}
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full bg-white/5 border-b border-white/10 py-3 px-1 text-white focus:outline-none ${
                isLogin ? "focus:border-neonBlue" : "focus:border-neonPurple"
              }`}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
                isLogin ? "bg-neonBlue text-black" : "bg-neonPurple text-white"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Get Started"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
              Resume.AI Secure Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
