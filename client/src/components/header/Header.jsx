import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, User, Monitor } from "lucide-react"; 
import ResumeAI from "../../assets/resume_ai.svg";

export default function Header() {
  const navigate = useNavigate();
  
  // --- USER STATE ---
  const [displayName, setDisplayName] = useState("User");
  const [email, setEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- SYSTEM STATUS STATE ---
  const [systemStatus, setSystemStatus] = useState("CHECKING"); // CHECKING | ONLINE | OFFLINE

  // 1. User Logic (Extract Name/Email)
  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const userObj = JSON.parse(storedUserStr);
        setEmail(userObj.email || "");
        
        if (userObj.name && userObj.name !== "User") {
          setDisplayName(userObj.name);
        } else if (userObj.email) {
          const nameFromEmail = userObj.email.split("@")[0];
          setDisplayName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  // 2. SYSTEM HEARTBEAT LOGIC
  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Ping the new backend route
        const response = await fetch("http://localhost:5000/api/ai/health"); 
        
        if (response.ok) {
          setSystemStatus("ONLINE");
        } else {
          setSystemStatus("OFFLINE");
        }
      } catch (error) {
        setSystemStatus("OFFLINE");
      }
    };

    // Check immediately on mount
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // --- HELPER FOR STATUS STYLING ---
  const getStatusConfig = () => {
    switch (systemStatus) {
      case "ONLINE":
        return { color: "text-green-400", dot: "bg-green-500", text: "SYSTEM ONLINE" };
      case "OFFLINE":
        return { color: "text-red-400", dot: "bg-red-500", text: "SYSTEM OFFLINE" };
      case "CHECKING":
      default:
        return { color: "text-yellow-400", dot: "bg-yellow-500", text: "CONNECTING..." };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-cardDark border-b border-cardStroke relative z-50">
      
      {/* LEFT: LOGO */}
      <div 
        className="flex flex-col cursor-pointer group" 
        onClick={() => navigate("/dashboard")}
      >
        <div className="flex items-center gap-3">
          <img
            src={ResumeAI}
            alt="Resume AI"
            className="w-8 h-8 bg-neonCyan p-1.5 rounded-md shadow-[0_0_10px_rgba(34,211,238,0.6)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all"
          />
          <h1 className="text-lg font-bold text-neonBlue">
            <span className="text-white">RESUME</span>.AI
          </h1>
        </div>

        {/* DYNAMIC SYSTEM STATUS */}
        <div className="flex items-center gap-1.5 mt-1 transition-colors duration-500">
          <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${systemStatus === "ONLINE" ? "animate-pulse" : ""}`}></div>
          <p className={`text-[10px] ${statusConfig.color} font-mono tracking-wide flex items-center gap-1`}>
            {statusConfig.text}
          </p>
        </div>
      </div>

      {/* RIGHT: USER PROFILE */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-white/5 p-2 pr-3 rounded-lg transition-all border border-transparent hover:border-white/10"
        >
          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-neonBlue/20 to-purple-500/20 flex items-center justify-center text-neonBlue font-bold border border-neonBlue/30 shadow-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
          
          {/* Name & Role */}
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-gray-200 text-sm font-medium">{displayName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Free Plan</p>
          </div>
          
          <ChevronDown 
            size={14} 
            className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
          />
        </button>

        {/* DROPDOWN MENU */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)} 
            />
            
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <p className="text-sm text-white font-medium truncate">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
              </div>

              <div className="py-1">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
                >
                  <Monitor size={16} className="text-neonCyan" />
                  Dashboard
                </button>
                
                <button 
                  onClick={() => {/* Navigate to profile if you have one */}}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors"
                >
                  <User size={16} className="text-purple-400" />
                  Profile Settings
                </button>
              </div>

              <div className="border-t border-slate-800 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}