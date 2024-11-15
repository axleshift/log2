import express from "express";
import auth from "./auth.js";
import warehouse from "./warehouse.js";
import tracking from "./tracking.js";
import logistics from "./logistics.js";
import inventory from "./inventory.js";
import Location from "./location.js";

const router = express.Router();

// Use routes
router.use("/auth", auth);
router.use("/warehouse", warehouse);
router.use("/tracking", tracking);
router.use("/logistics", logistics);
router.use("/inventory", inventory);
router.use("/Location", Location);

export default router;
