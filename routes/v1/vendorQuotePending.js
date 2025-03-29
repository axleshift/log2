import express from "express";
import { createVendorQuote, getAllVendorQuotes, updateVendorQuoteStatus } from "../../controller/vendorQuotePending.js";

const router = express.Router();

router.post("/", createVendorQuote);
router.get("/", getAllVendorQuotes);
router.put("/:id/status", updateVendorQuoteStatus);

export default router;
