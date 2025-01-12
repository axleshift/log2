import express from "express";
import { createInventory, getAllInventory, getInventoryByTrackingId, updateInventoryByTrackingId, deleteInventoryByTrackingId, getInventoryByWarehouse } from "../../controller/inventoryController.js";

const router = express.Router();

router.post("/", createInventory);
router.get("/", getAllInventory);
router.get("/:tracking_id", getInventoryByTrackingId);
router.put("/:tracking_id", updateInventoryByTrackingId);
router.delete("/:tracking_id", deleteInventoryByTrackingId);

router.get("/warehouse/:warehouse_id", getInventoryByWarehouse);
export default router;
