import express from "express";
import { createRFQ, submitQuote, selectVendor, closeRFQ, getRFQDetails, getRFQs, deleteRFQ, getRFQById } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", tokenMiddleware, createRFQ);
router.post("/submit-quote", submitQuote);
router.post("/select-vendor", selectVendor);
router.post("/close", closeRFQ);
router.get("/:rfqId", getRFQDetails);
router.get("/", getRFQs);
//router.get("/rfq/:id", getRFQById);
router.delete("/:id", deleteRFQ);
router.get("/:id", getRFQById);

export default router;
