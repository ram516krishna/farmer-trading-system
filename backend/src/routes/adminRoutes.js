import express from "express";
import {
  login,
  getAdmin,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { passwordResetLimiter, passwordResetConfirmLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/login", login);
router.get("/", isAdmin, getAdmin);
router.post("/logout", logout);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", passwordResetConfirmLimiter, resetPassword);

export default router;