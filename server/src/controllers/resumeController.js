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
