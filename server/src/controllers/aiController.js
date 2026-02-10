import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { genAI } from "../utils/geminiClient.js";
import Resume from "../models/Resume.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeResume = async (req, res) => {
  try {
    const { resumePath, jobRole, jobDescription, resumeId } = req.body;

    if (!resumePath) {
      return res.status(400).json({ error: "Resume path is required" });
    }

    // Resolve paths relative to project root
    // __dirname is server/src/controllers, so go up 3 levels to project root
    const projectRoot = path.resolve(__dirname, "../../..");
    const aiServicePath = path.resolve(projectRoot, "ai-service");
    const pythonExe = path.resolve(aiServicePath, "venv/Scripts/python.exe");
    const scriptPath = path.resolve(aiServicePath, "extract_text.py");
    
    console.log("Python executable path:", pythonExe);
    console.log("Script path:", scriptPath);
    console.log("Working directory:", aiServicePath);

    // 1️⃣ Run Python AI (explicit venv python)
    // Pass jobRole and jobDescription as command-line arguments
    const python = spawn(
      pythonExe,
      [
        scriptPath,
        resumePath,
        jobRole || "Software Developer",
        jobDescription || "",
      ],
      {
        cwd: aiServicePath,
      }
    );

    // Handle spawn errors
    python.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      console.error("Python path:", pythonExe);
      console.error("Script path:", scriptPath);
      return res.status(500).json({ 
        error: "Failed to start AI service",
        details: err.message 
      });
    });

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (err) => {
      const errorText = err.toString();
      errorOutput += errorText;
      console.error("Python stderr:", errorText);
    });

    python.on("close", async (code) => {
      console.log(`Python process exited with code ${code}`);
      console.log("Python stdout:", output);
      console.log("Python stderr:", errorOutput);
      
      // Check if Python process failed
      if (code !== 0) {
        console.error(`Python process failed with exit code ${code}`);
        return res.status(500).json({ 
          error: "Python analysis failed",
          details: errorOutput || `Process exited with code ${code}` 
        });
      }
      
      if (!output || output.trim() === "") {
        console.error("No output from Python process");
        return res.status(500).json({ 
          error: "No output from AI service",
          details: errorOutput || "Python process completed but produced no output"
        });
      }

      let analysis;
      try {
        // Try to parse JSON - Python outputs JSON to stdout
        const cleanOutput = output.trim();
        analysis = JSON.parse(cleanOutput);
        console.log("Parsed analysis:", JSON.stringify(analysis, null, 2));
      } catch (e) {
        console.error("Invalid JSON from Python:", output);
        console.error("Parse error:", e.message);
        return res.status(500).json({ 
          error: "Invalid AI response",
          details: `Failed to parse JSON: ${e.message}`,
          rawOutput: output.substring(0, 500) // First 500 chars for debugging
        });
      }

      // Validate analysis has required fields
      if (!analysis || typeof analysis !== 'object') {
        console.error("Analysis is not a valid object:", analysis);
        return res.status(500).json({ error: "Invalid analysis structure" });
      }

      // Ensure analysis has at least a finalScore or live_scores
      if (!analysis.finalScore && !analysis.live_scores?.overall) {
        console.error("Analysis missing score data:", analysis);
        return res.status(500).json({ error: "Analysis missing required score data" });
      }

      // Save analysis results to database immediately (without suggestions)
      if (resumeId) {
        try {
          // Save the analysis object as-is (Python output structure)
          const updateData = {
            jobRole: jobRole || analysis.jobRole || "Software Developer",
            jobDescription: jobDescription || "",
            analysis: analysis, // Save the entire analysis object from Python
            analyzedAt: new Date(),
          };

          const updated = await Resume.findByIdAndUpdate(
            resumeId,
            updateData,
            { new: true, runValidators: false } // Don't validate schema strictly
          );
          
          if (updated) {
            console.log("Analysis saved to database for resume:", resumeId);
            console.log("Analysis keys:", Object.keys(analysis));
          } else {
            console.error("Failed to update resume:", resumeId);
          }
        } catch (dbError) {
          console.error("Error saving analysis to database:", dbError);
          console.error("DB Error details:", dbError.message);
          console.error("DB Error stack:", dbError.stack);
          // Continue even if DB save fails, but log the error
        }
      }

      // Return analysis immediately without Gemini suggestions
      res.json({
        analysis,
        resumeId: resumeId, // Return resumeId for frontend to request suggestions later
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI processing failed" });
  }
};

// Get AI suggestions for a resume (called separately when user clicks button)
export const getAISuggestions = async (req, res) => {
  try {
    const { resumeId, jobRole, jobDescription, analysis } = req.body;

    if (!resumeId) {
      return res.status(400).json({ error: "Resume ID is required" });
    }

    if (!analysis) {
      return res.status(400).json({ error: "Analysis data is required" });
    }

    // Generate Gemini suggestions
    const prompt = `
You are a professional technical recruiter.

Role: ${jobRole || "Software Developer"}
Match Score: ${analysis.finalScore || analysis.live_scores?.overall || 0}%
Missing Skills: ${(analysis.missingSkills || []).join(", ")}

Give 3 concise resume improvement suggestions.
`;

    let suggestions = "";
    let error = null;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      suggestions = response.text;
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      error = geminiError.message || "Unable to generate suggestions at this time. Please try again later.";
      suggestions = "";
    }

    // Update resume with suggestions in database
    try {
      await Resume.findByIdAndUpdate(
        resumeId,
        {
          suggestions: suggestions,
        },
        { new: true }
      );
    } catch (dbError) {
      console.error("Error saving suggestions to database:", dbError);
      // Continue even if DB save fails
    }

    if (error) {
      return res.status(500).json({ 
        error: error,
        suggestions: "" 
      });
    }

    res.json({
      suggestions: suggestions,
    });
  } catch (err) {
    console.error("Error generating AI suggestions:", err);
    res.status(500).json({ error: "Failed to generate AI suggestions" });
  }
};
