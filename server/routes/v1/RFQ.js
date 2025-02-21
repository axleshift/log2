import express from "express";
import { createRFQ, inviteToRFQ, submitQuote, awardVendor, getRFQById, getAllRFQs, updatePaymentTerms, closeRFQ, deleteRFQ } from "../../controller/RFQ.js";
const router = express.Router();

router.post("/", createRFQ);
router.get("/", getAllRFQs);
router.post("/:id/invite", inviteToRFQ);
router.post("/:id/quote", submitQuote);
router.post("/:id/award", awardVendor);
router.get("/:id", getRFQById);
router.put("/rfq/update-payment-terms", updatePaymentTerms);
router.patch("/:id/close", closeRFQ);
router.delete("/:id/delete", deleteRFQ);

export default router;
