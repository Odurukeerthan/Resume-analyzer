import jwt from "jsonwebtoken";
import {
  registerUserService,
  loginUserService,
} from "../services/authService.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);

    res.status(201).json({
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await loginUserService(req.body);

    res.json({
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
