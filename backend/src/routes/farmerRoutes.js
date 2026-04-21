import { Router } from "express";
import { getFarmers, addFarmer, login, getFarmerProducts, getFarmerEarnings, deleteFarmer } from "../controllers/farmerController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = Router();

router.get("/", isAdmin, getFarmers);
router.post("/", isAdmin, addFarmer);
router.post("/login", login)
router.get("/:id/products", getFarmerProducts)
router.get("/:id/earnings", isAdmin, getFarmerEarnings)
router.delete("/:id", isAdmin, deleteFarmer)

export default router;