import Resume from "../models/Resume.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.filename,
    filePath: req.file.path,
  });

  // Return absolute path for Python service
  // __dirname is server/src/controllers, so go up to server root
  // req.file.path is relative like "src/uploads/filename.pdf"
  const serverRoot = path.resolve(__dirname, "../..");
  const absolutePath = path.resolve(serverRoot, req.file.path);

  res.status(201).json({
    message: "Resume uploaded successfully",
    resume: {
      ...resume.toObject(),
      absolutePath,
    },
  });
};

// Get recent scans for the authenticated user
export const getRecentScans = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4; // Default to 4 recent scans
    
    const scans = await Resume.find({ user: req.user._id })
      .sort({ analyzedAt: -1, createdAt: -1 }) // Sort by analyzedAt first, then createdAt
      .limit(limit)
      .select("fileName analysis jobRole analyzedAt createdAt")
      .lean();

    // Format scans for frontend
    const formattedScans = scans.map((scan) => {
      const score = scan.analysis?.finalScore || scan.analysis?.live_scores?.overall || 0;
      const timeAgo = formatTimeAgo(scan.analyzedAt || scan.createdAt);
      
      return {
        id: scan._id.toString(),
        name: scan.fileName || "Resume",
        score: Math.round(score),
        time: timeAgo,
        jobRole: scan.jobRole || "Software Developer",
        analyzedAt: scan.analyzedAt || scan.createdAt,
      };
    });

    res.json({ scans: formattedScans });
  } catch (error) {
    console.error("Error fetching recent scans:", error);
    res.status(500).json({ message: "Failed to fetch recent scans" });
  }
};

// Helper function to format time ago
function formatTimeAgo(date) {
  if (!date) return "Unknown";
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return past.toLocaleDateString();
  }
}
// Get score history for the graph (Last 6 scans, chronological)
export const getScoreHistory = async (req, res) => {
  try {
    // 1. Fetch the 6 most recent scans
    const scans = await Resume.find({ user: req.user._id })
      .sort({ analyzedAt: -1 }) // Sort by newest first
      .limit(6)
      .select("analysis analyzedAt createdAt");

    // 2. Reverse them to chronological order for the graph (Left to Right)
    const history = scans.reverse().map((scan) => {
      // Safely extract score (handle nested objects)
      const score = scan.analysis?.finalScore || scan.analysis?.live_scores?.overall || 0;
      
      return {
        score: Math.round(score),
        date: scan.analyzedAt || scan.createdAt,
      };
    });

    res.json(history);
  } catch (error) {
    console.error("Error fetching score history:", error);
    res.status(500).json({ message: "Failed to fetch score history" });
  }
};
