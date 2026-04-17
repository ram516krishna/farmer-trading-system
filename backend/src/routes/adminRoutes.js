import express from "express";
import { login, getAdmin, logout } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/login", login);
router.get("/", isAdmin, getAdmin);
router.post("/logout",  logout);

export default router;