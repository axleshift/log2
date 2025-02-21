import express from "express";
import { createPurchaseOrder, getPurchaseOrders, updatePurchaseOrder, deletePurchaseOrder } from "../../controller/purchaseOrder.js";

const router = express.Router();

router.post("/", createPurchaseOrder);
router.get("/", getPurchaseOrders);
router.put("/:purchaseOrderId", updatePurchaseOrder);
router.delete("/:purchaseOrderId", deletePurchaseOrder);

export default router;
