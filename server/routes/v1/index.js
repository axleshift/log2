import express from "express";
import auth from "./auth.js";
import warehouse from "./warehouse.js";
import tracking from "./tracking.js";
import logistics from "./logistics.js";
import inventory from "./inventory.js";
import profile from "./profile.js";
import vendor from "./vendor.js";
import product from "./product.js";
import RFQ from "./RFQ.js";
import bid from "./bid.js";
import payments from "./payments.js";

const router = express.Router();

// Use routes
router.use("/auth", auth);
router.use("/warehouse", warehouse);
router.use("/tracking", tracking);
router.use("/logistics", logistics);
router.use("/inventory", inventory);
router.use("/profile", profile);
router.use("/vendor", vendor);
router.use("/product", product);
router.use("/rfq", RFQ);
router.use("/bid", bid);
router.use("/payments", payments);

export default router;
