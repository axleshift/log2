import express from "express";
import { getInventories, getInventoryByTrackingId as getInventory, createInventory, updateInventoryByTrackingId as updateInventory, deleteInventoryByTrackingId as deleteInventory } from "../../controller/inventoryController.js";

const router = express.Router();

router.get("/", getInventories);

router.get("/:tracking_id", getInventory);
router.post("/", createInventory);
router.put("/:tracking_id", updateInventory);
router.delete("/:tracking_id", deleteInventory);

export default router;
