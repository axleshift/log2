import express from "express";
import authRoute from "./authRoute.js";
import trackingRoute from "./trackingRoute.js";


const router = express.Router();

// Use routes
router.use("/auth", authRoute);
router.use("/tracking", trackingRoute);

export default router;
