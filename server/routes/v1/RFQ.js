import express from "express";
import { createRFQ, closeRFQ, getRFQDetails, getRFQs, deleteRFQ, getVendorRFQs, getVendorRFQsByID, submitQuote } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
const router = express.Router();

// Existing Routes
router.post("/create", tokenMiddleware, createRFQ);
router.post("/close", closeRFQ);
router.get("/:rfqId", getRFQDetails);
router.get("/", getRFQs);
router.delete("/:id", deleteRFQ);
router.get("/vendor/rfqs", tokenMiddleware, getVendorRFQs);
router.get("/vendor/rfqs/:id", tokenMiddleware, getVendorRFQsByID);

// New Route for submitting quotes
router.post("/vendor/rfqs/:id/submit-quote", tokenMiddleware, submitQuote);

export default router;
