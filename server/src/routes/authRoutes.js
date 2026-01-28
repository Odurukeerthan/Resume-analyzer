import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/authValidation.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;
