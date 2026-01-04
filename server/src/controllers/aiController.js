import { spawn } from "child_process";
import { genAI } from "../utils/geminiClient.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumePath, jobRole, jobDescription } = req.body;

    // 1️⃣ Run Python AI (explicit venv python)
    const python = spawn(
  "../ai-service/venv/Scripts/python.exe",
  ["extract_text.py", resumePath],
  {
    cwd: "../ai-service", // ⭐ CRITICAL FIX
  }
);


    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    python.on("close", async () => {
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
