import express from "express";
import { getTrackingItems, createTrackingItem, updateTrackingItem, deleteTrackingItem } from "../../controller/trackingController.js";

const router = express.Router();

// Route to get all trucking items
router.get("/", getTrackingItems);

// Route to create a new trucking item
router.post("/", createTrackingItem);

// Route to update a trucking item by ID
router.put("/:id", updateTrackingItem);

// Route to delete a trucking item by ID
router.delete("/:id", deleteTrackingItem);

export default router;
