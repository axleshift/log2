import express from "express";
import { createVendorQuote, getAllVendorQuotes, updateVendorQuoteStatus, deleteVendorQuote } from "../../controller/vendorQuotePending.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createVendorQuote);
router.get("/", getAllVendorQuotes);
router.put("/:id/status", updateVendorQuoteStatus);
router.delete("/:id", deleteVendorQuote);

export default router;
