import express from "express";
import { createWarehouse, getAllWarehouses, getWarehouseById, updateWarehouseById, deleteWarehouseById } from "../../controller/warehouseController.js";

const router = express.Router();

router.post("/", createWarehouse);
router.get("/", getAllWarehouses);
router.get("/:warehouse_id", getWarehouseById);
router.put("/:warehouse_id", updateWarehouseById);
router.delete("/:warehouse_id", deleteWarehouseById);

export default router;
