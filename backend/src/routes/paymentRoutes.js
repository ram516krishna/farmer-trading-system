import { Router } from "express";
import { createPayment, getFarmerPayments, getPaymentById, deletePayment } from "../controllers/paymentController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Create a new payment
router.post("/", isAdmin, createPayment);

// Get all payments for a specific farmer
router.get("/farmer/:farmerId", isAdmin, getFarmerPayments);

// Get a specific payment by ID
router.get("/:id", isAdmin, getPaymentById);

// Delete a payment
router.delete("/:id", isAdmin, deletePayment);

export default router;
