import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerUserService } from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    await registerUserService(req.body);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerifyToken: token,
    emailVerifyExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpiry = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res.status(403).json({ message: "Please verify your email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
};
