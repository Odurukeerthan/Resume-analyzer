import express from "express";
import protect from "../middleware/authMiddleware.js";
import { analyzeResume } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeResume);

export default router;
