import express from "express";
import { createVendorQuote, getAllVendorQuotes, updateVendorQuoteStatus } from "../../controller/vendorQuotePending.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createVendorQuote);
router.get("/", getAllVendorQuotes);
router.put("/:id/status", updateVendorQuoteStatus);

export default router;
