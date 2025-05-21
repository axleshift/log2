import express from "express";
import { createVendorQuote, getAllVendorQuotes, updateVendorQuoteStatus, deleteVendorQuote, getVendorQuoteStatus } from "../../controller/vendorQuotePending.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createVendorQuote);
router.get("/", getAllVendorQuotes);
router.get("/status/:rfqId", tokenMiddleware, getVendorQuoteStatus);
router.put("/:id/status", updateVendorQuoteStatus);
router.delete("/:id", deleteVendorQuote);

export default router;
