import express from "express";
import { createWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse, deleteWarehouse, getInventoryByWarehouseId } from "../../controller/warehouseController.js";

const router = express.Router();

router.post("/", createWarehouse);
router.get("/", getAllWarehouses);
router.get("/:warehouse_id", getWarehouseById);
router.put("/:warehouse_id", updateWarehouse);
router.delete("/:warehouse_id", deleteWarehouse);
router.get("/:warehouse_id/inventory", getInventoryByWarehouseId);

export default router;
