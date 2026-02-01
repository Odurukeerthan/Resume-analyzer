import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { registerUserService } from "../services/authService.js";
import { sendEmail } from "../utils/sendEmail.js";

/* REGISTER */
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

/* VERIFY EMAIL */
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

  // Generate JWT token for auto-login
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ 
    message: "Email verified successfully",
    token: jwtToken 
  });
};

/* RESEND VERIFICATION */
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.emailVerifyToken = token;
  user.emailVerifyExpiry = Date.now() + 60 * 60 * 1000;
  await user.save();

  const link = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your Resume.AI account",
    html: `<p>Click to verify:</p><a href="${link}">Verify Email</a>`,
  });

  res.json({ message: "Verification email resent" });
};

/* LOGIN */
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
