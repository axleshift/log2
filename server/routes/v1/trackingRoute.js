import express from "express";
import { getTrackingItems, createTrackingItem, updateTrackingItem, deleteTrackingItem } from "../../controller/trackingController.js";

const router = express.Router();

router.get("/", getTrackingItems);
router.post("/", createTrackingItem);
router.put("/:id", updateTrackingItem);
router.delete("/:id", deleteTrackingItem);

export default router;
