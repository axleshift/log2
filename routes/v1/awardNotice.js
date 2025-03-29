import express from "express";
import { createAwardNotice, getRecentAwardNotices, getAwardNoticeById } from "../../controller/awardNoticeController.js";

const router = express.Router();

router.post("/", createAwardNotice);
router.get("/", getRecentAwardNotices);
router.get("/:id", getAwardNoticeById);

export default router;
