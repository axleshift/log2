import express from "express";
import { createRFQ, submitQuote, selectVendor, closeRFQ, getRFQDetails, getRFQs, deleteRFQ } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", tokenMiddleware, createRFQ);
router.post("/submit-quote", tokenMiddleware, submitQuote);
router.post("/select-vendor", tokenMiddleware, selectVendor);
router.post("/close", closeRFQ);
router.get("/:rfqId", getRFQDetails);
router.get("/", getRFQs);
router.delete("/:id", deleteRFQ);

export default router;
