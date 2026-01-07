import { useState } from "react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center perspective-1000">
      <div
        className={`relative w-95 h-105 transition-transform duration-700 transform-style-preserve-3d
        ${!isLogin ? "rotate-y-180" : ""}`}
      >
        {/* LOGIN */}
        <div className="absolute inset-0 backface-hidden bg-cardDark rounded-xl p-8 border border-neonBlue/30">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">Login</h2>
          <form className="space-y-4">
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Password" type="password" />
            <button className="btn-primary">Login</button>
          </form>
          <p className="switch" onClick={() => setIsLogin(false)}>
            Create an account
          </p>
        </div>

        {/* REGISTER */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-cardDark rounded-xl p-8 border border-neonPurple/30">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">Register</h2>
          <form className="space-y-4">
            <input className="input" placeholder="Username" />
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Password" type="password" />
            <button className="btn-primary">Register</button>
          </form>
          <p className="switch" onClick={() => setIsLogin(true)}>
            Already have an account?
          </p>
        </div>
      </div>
    </div>
  );
}
