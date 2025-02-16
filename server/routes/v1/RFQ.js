import express from "express";
import { createRFQ, getAllRFQs, getRFQById, addVendorsToRFQ, submitQuote, awardRFQ } from "../../controller/RFQ.js";

const router = express.Router();

router.post("/", createRFQ);
router.get("/", getAllRFQs);
router.get("/:id", getRFQById);
router.put("/:id/vendors", addVendorsToRFQ);
router.post("/:id/quotes", submitQuote);
router.patch("/:id/award", awardRFQ);

export default router;
