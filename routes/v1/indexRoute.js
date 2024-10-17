import express from "express";
import authRoutes from "./authRoute.js";
import invoiceRoutes from "./invoiceRoute.js";
import trackingRoutes from "./trackingRoute.js";
import inventoryRoutes from "./inventoryRoute.js";

const router = express.Router();
// Use routes
router.use("/auth", authRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/tracking", trackingRoutes);

export default router;
