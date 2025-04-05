import express from "express";
import { createRFQ, closeRFQ, getRFQDetails, getRFQs, deleteRFQ, getVendorRFQs, getVendorRFQsByID, submitQuote } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
const router = express.Router();

// Specific vendor routes come first
router.get("/vendor/rfqs", tokenMiddleware, getVendorRFQs);
router.get("/vendor/my-rfqs", tokenMiddleware, getVendorRFQsByID);

// Then general ones
router.post("/create", tokenMiddleware, createRFQ);
router.post("/close", closeRFQ);
router.get("/:rfqId", getRFQDetails);
router.get("/", getRFQs);
router.delete("/:id", deleteRFQ);

// Submit quote last
router.post("/vendor/rfqs/:id/submit-quote", tokenMiddleware, submitQuote);

export default router;
