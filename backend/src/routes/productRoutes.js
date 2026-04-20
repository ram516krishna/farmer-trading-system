import {upload} from "../config/multer.js"
import express from "express";
import { addProduct, deleteProduct, getAllProducts, getDashboardStats, updateProduct, getFarmerProducts } from "../controllers/productController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/", isAdmin, upload.single('receipt'), addProduct);

router.get("/", isAdmin, getAllProducts);

// DASHBOARD STATS
router.get("/stats", isAdmin, getDashboardStats);

// DELETE
router.delete("/:id", isAdmin, deleteProduct);

// UPDATE
router.put("/:id", isAdmin, updateProduct);

router.get("/farmer/:id", getFarmerProducts);


export default router;
