import express from "express";
import mongoose from "mongoose"; // <--- Added import
import protect from "../middleware/authMiddleware.js";
import { analyzeResume, getAISuggestions } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeResume);
router.post("/suggestions", protect, getAISuggestions);

// --- NEW HEALTH CHECK ENDPOINT ---
router.get("/health", (req, res) => {
  // Check if Mongoose is connected (1 = Connected)
  const isDbConnected = mongoose.connection.readyState === 1;
  
  if (isDbConnected) {
    res.status(200).json({ status: "ONLINE", db: "CONNECTED" });
  } else {
    // If DB is down, return 503 so frontend knows system is degraded
    res.status(503).json({ status: "DEGRADED", db: "DISCONNECTED" });
  }
});

export default router;