import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { genAI } from "../utils/geminiClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeResume = async (req, res) => {
  try {
    const { resumePath, jobRole, jobDescription } = req.body;

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

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    python.on("close", async (code) => {
      console.log(`Python process exited with code ${code}`);
      if (!output) {
        return res.status(500).json({ error: "No output from AI service" });
      }

      let analysis;
      try {
        analysis = JSON.parse(output);
      } catch (e) {
        console.error("Invalid JSON from Python:", output);
        return res.status(500).json({ error: "Invalid AI response" });
      }

      // 2️⃣ Gemini suggestions (NEW SDK)
      const prompt = `
You are a professional technical recruiter.

Role: ${jobRole}
Match Score: ${analysis.finalScore}%
Missing Skills: ${analysis.missingSkills.join(", ")}

Give 3 concise resume improvement suggestions.
`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({
        analysis,
        suggestions: response.text,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI processing failed" });
  }
};
