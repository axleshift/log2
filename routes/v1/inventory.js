import express from "express";
import { createInventory, getAllInventory, getInventoryById, updateInventory, deleteInventory } from "../../controller/inventoryController.js";

const router = express.Router();

router.post("/", createInventory);
router.get("/", getAllInventory);
router.get("/:id", getInventoryById);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
