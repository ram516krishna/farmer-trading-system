import { Router } from "express";
import { getFarmers, addFarmer, login } from "../controllers/farmerController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = Router();

router.get("/", isAdmin, getFarmers);
router.post("/", isAdmin, addFarmer);
router.post("/login", login)


export default router;