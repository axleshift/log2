import express from "express";
import authRoute from "./authRoute.js";
import trackingRoute from "./trackingRoute.js";
import inventoryRoute from "./inventoryRoute.js";
import invoiceRoute from "./invoiceRoute.js";

const router = express.Router();

// Use routes
router.use("/auth", authRoute);
router.use("/inventory", inventoryRoute);
router.use("/tracking", trackingRoute);
router.use("/invoice", invoiceRoute);

export default router;
