import express from "express";
import { publishBid, getBids, getBidById, submitBid, evaluateBid, awardBid } from "../../controller/Bid.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/publish", publishBid);
router.get("/all", getBids);
router.get("/:bidId", getBidById);
router.post("/submit", tokenMiddleware, submitBid);
router.post("/evaluate", evaluateBid);
router.post("/award", awardBid);

export default router;
