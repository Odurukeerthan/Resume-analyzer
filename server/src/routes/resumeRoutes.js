import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadResume, getRecentScans,getScoreHistory } from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/recent", protect, getRecentScans);
router.get("/history", protect, getScoreHistory);
export default router;
