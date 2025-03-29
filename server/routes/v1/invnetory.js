import express from "express";
import { createInventoryItem, getAllInventory, getInventoryById, updateInventoryItem, deleteInventoryItem } from "../../controller/inventoryController";
import { tokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", tokenMiddleware, getAllInventory);
router.post("/", tokenMiddleware, createInventoryItem);
router.get("/:id", tokenMiddleware, getInventoryById);
router.put("/:id", tokenMiddleware, updateInventoryItem);
router.delete("/:id", tokenMiddleware, deleteInventoryItem);

export default router;
