import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { DISPOSABLE_DOMAINS } from "../utils/disposableDomains.js";

export const registerUserService = async ({ name, email, password }) => {
  const domain = email.split("@")[1];

  if (DISPOSABLE_DOMAINS.includes(domain)) {
    throw new Error("Disposable email addresses are not allowed");
  }

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    emailVerifyToken: token,
    emailVerifyExpiry: Date.now() + 1000 * 60 * 60, // 1 hour
  });

  const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your Resume.AI account",
    html: `
      <h3>Welcome to Resume.AI</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyLink}">Verify Email</a>
    `,
  });

  return user;
};

export const loginUserService = async ({ email, password }) => {
  const cleanEmail = validator.normalizeEmail(email);

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};
