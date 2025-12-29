import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.filename,
    filePath: req.file.path,
  });

  res.status(201).json({
    message: "Resume uploaded successfully",
    resume,
  });
};
