import express from "express";
import { createPurchaseOrder, getAllPurchaseOrders, getPurchaseOrderById, updatePurchaseOrderStatus, deletePurchaseOrder, addPaymentToPurchaseOrder } from "../../controller/purchaseOrder.js";

const router = express.Router();

router.post("/", createPurchaseOrder);
router.get("/", getAllPurchaseOrders);
router.get("/:id", getPurchaseOrderById);
router.put("/:id/status", updatePurchaseOrderStatus);
router.delete("/:id", deletePurchaseOrder);
router.post("/:id/payments", addPaymentToPurchaseOrder);

export default router;
