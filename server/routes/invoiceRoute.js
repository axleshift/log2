import express from "express";
import { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } from "../controller/invoiceController.js";

const router = express.Router(); // creates new router object to handle routes for invoices

router.get("/", getInvoices); // Route to fetch all invoices
router.get("/:id", getInvoice); // Route to fetch a single invoice by ID
router.post("/", createInvoice); // Route to create a new invoice
router.put("/:id", updateInvoice); // Route to update an existing invoice by ID
router.delete("/:id", deleteInvoice); // Route to delete an invoice by ID

export default router;
