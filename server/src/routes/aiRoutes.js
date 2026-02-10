import express from "express";
import protect from "../middleware/authMiddleware.js";
import { analyzeResume, getAISuggestions } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeResume);
router.post("/suggestions", protect, getAISuggestions);

export default router;
