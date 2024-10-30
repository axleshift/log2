import express from "express";
import { createWarehouse, getWarehouses, getWarehouseById, updateWarehouseById, deleteWarehouseById } from "../../controller/warehouseController.js";

const router = express.Router();

router.post("/", createWarehouse);

router.get("/", getWarehouses);
router.get("/:id", getWarehouseById);
router.put("/:id", updateWarehouseById);
router.delete("/:id", deleteWarehouseById);

export default router;
