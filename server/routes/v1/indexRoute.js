import express from "express";
import authRoute from "./authRoute.js";
import warehouseRoute from "./warehouseRoute.js";
import trackingRoute from "./trackingRoute.js";
import logisticsRoute from "./logisticsRoute.js";
const router = express.Router();

// Use routes
router.use("/auth", authRoute);
router.use("/warehouse", warehouseRoute);
router.use("/tracking", trackingRoute);
router.use("/logistics", logisticsRoute);

export default router;
