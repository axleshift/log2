import express from "express";
import { createRFQ, getAllRFQs, getRFQById, sendInviteEmail, inviteToRFQ, submitQuote, awardRFQ } from "../../controller/RFQ.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createRFQ);
router.get("/", getAllRFQs);
router.get("/:id", getRFQById);
router.post("/send-invite-email", sendInviteEmail);
router.put("/:id/invite-vendors", inviteToRFQ);
router.post("/:id/submit-quotes", submitQuote);
router.patch("/:id/award", awardRFQ);

export default router;
