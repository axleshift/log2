import express from "express";
import { deleteMultipleInventories, getInventories, getInventory, createInventory, updateInventory, deleteInventory } from "../../controller/inventoryController.js";

const router = express.Router();

router.get("/", getInventories);
router.get("/:tracking_id", getInventory);
router.post("/", createInventory);
router.put("/:tracking_id", updateInventory);
router.delete("/:tracking_id", deleteInventory);
router.delete("/bulk-delete", deleteMultipleInventories);

export default router;
