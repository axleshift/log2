import express from "express";
import { createNotification, getUserNotifications, markAsRead, deleteNotification } from "../../controller/notification.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createNotification);
router.get("/", tokenMiddleware, getUserNotifications);
router.put("/:id/read", tokenMiddleware, markAsRead);
router.delete("/:id", tokenMiddleware, deleteNotification);

export default router;
