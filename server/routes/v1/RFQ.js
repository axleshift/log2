import express from "express";
import { createRFQ, getAllRFQs, getRFQById, inviteToRFQ, submitQuote, awardRFQ } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createRFQ);
router.get("/", getAllRFQs);
router.get("/:id", getRFQById);
router.put("/:id/invite-vendors", inviteToRFQ);
router.post("/:id/quotes", submitQuote);
router.patch("/:id/award", awardRFQ);

export default router;
