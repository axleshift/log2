import express from "express";
import { createRFQ, closeRFQ, getRFQDetails, deleteRFQ, getVendorRFQs, submitQuote, getVendorRFQById } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Vendor routes - require auth
router.get("/vendor/rfqs", tokenMiddleware, getVendorRFQs);
router.get("/vendor/rfqs/:id", tokenMiddleware, getVendorRFQById);
router.post("/vendor/rfqs/:id/submit-quote", tokenMiddleware, submitQuote);

// RFQ management routes - require authentication
router.post("/create", tokenMiddleware, createRFQ);
router.post("/close", tokenMiddleware, closeRFQ);
router.delete("/:id", tokenMiddleware, deleteRFQ);

// Public routes (no auth)
router.get("/:rfqId", getRFQDetails);

export default router;
