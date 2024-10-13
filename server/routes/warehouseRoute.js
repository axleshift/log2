import express from "express";
import { getAllItems, createItem, updateItem, deleteItem, validateItem } from "../controller/warehouseController.js";

const router = express.Router();

router.get("/", getAllItems);
router.post("/", validateItem, createItem);
router.put("/:id", validateItem, updateItem);
router.delete("/:id", deleteItem);

export default router;
