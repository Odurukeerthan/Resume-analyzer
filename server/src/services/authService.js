import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.js";

export const registerUserService = async ({ name, email, password }) => {
  const cleanName = validator.escape(name.trim());
  const cleanEmail = validator.normalizeEmail(email);

  const userExists = await User.findOne({ email: cleanEmail });
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    password: hashedPassword,
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
