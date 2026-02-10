import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: String,
    filePath: String,
    jobRole: String,
    jobDescription: String,
    // Analysis results (mixed type to allow flexible structure)
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    suggestions: String, // Gemini suggestions
    analyzedAt: Date,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
