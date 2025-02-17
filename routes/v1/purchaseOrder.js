import express from "express";

const router = express.Router();

import { createPurchaseOrder, getPurchaseOrdersByStatus, updatePurchaseOrderStatus, attachDocuments } from "../../controller/purchaseOrder.js";
router.post("/", createPurchaseOrder);
router.get("/status/:status", getPurchaseOrdersByStatus);
router.put("/status/:id", updatePurchaseOrderStatus);
router.put("/attach-documents/:id", attachDocuments);

export default router;
