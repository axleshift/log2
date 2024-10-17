import express from "express";
import { getAllItems, createItem, updateItem, deleteItem, validateItem } from "../../controller/InventoryController.js";

const router = express.Router();

router.get("/", getAllItems);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
