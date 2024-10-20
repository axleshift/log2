import express from "express";
import { createInvoice, getAllInvoices, getInvoiceById, updateInvoiceById, deleteInvoiceById } from "../../controller/invoiceController.js";
const router = express.Router();

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoiceById);
router.delete("/:id", deleteInvoiceById);

export default router;
