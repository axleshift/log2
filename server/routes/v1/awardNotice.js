import express from "express";
import { createAwardNotice, getRecentAwardNotices, getAwardNoticeById, deleteAwardNotice } from "../../controller/awardNoticeController.js";

const router = express.Router();

router.post("/", createAwardNotice);
router.get("/", getRecentAwardNotices);
router.get("/:id", getAwardNoticeById);
router.delete("/:id", deleteAwardNotice);

export default router;
