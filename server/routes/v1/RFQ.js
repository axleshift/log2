import express from "express";
import { createRFQ, submitQuote, selectVendor, closeRFQ, getRFQDetails, getRFQs } from "../../controller/RFQ.js";

const router = express.Router();

router.post("/create", createRFQ);
router.post("/submit-quote", submitQuote);
router.post("/select-vendor", selectVendor);
router.post("/close", closeRFQ);
router.get("/:rfqId", getRFQDetails);
router.get("/", getRFQs);

export default router;
