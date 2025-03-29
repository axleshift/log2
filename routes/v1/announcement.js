import express from "express";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
import { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement } from "../../controller/announcement.js";

const router = express.Router();

router.post("/", tokenMiddleware, createAnnouncement);

router.get("/", tokenMiddleware, getAllAnnouncements);

router.get("/:id", tokenMiddleware, getAnnouncementById);

router.put("/:id", tokenMiddleware, updateAnnouncement);

router.delete("/:id", tokenMiddleware, deleteAnnouncement);

export default router;
