import Invoice from "../models/invoiceModel.js";
import { body, validationResult } from "express-validator";

// GET route to fetch all invoices
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json({ status: "success", data: invoices });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error fetching invoices", error: error.message });
    }
};

// GET single invoice by ID
const getInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ status: "error", message: "Invoice not found" });
        }
        res.status(200).json({ status: "success", data: invoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error fetching invoice", error: error.message });
    }
};

// POST create
const createInvoice = [
    // Validate input
    body("customerName").notEmpty().withMessage("Customer name is required"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("address").notEmpty().withMessage("Address is required"),
    body("contact").notEmpty().withMessage("Contact number is required"),
    body("receiptAdd").notEmpty().withMessage("Receipt address is required"),
    body("cost").isNumeric().withMessage("Cost must be a number"),
    body("weight").isNumeric().withMessage("Weight must be a number"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ status: "error", errors: errors.array() });
            }
            const invoiceData = req.body;
            const newInvoice = new Invoice(invoiceData);
            await newInvoice.save();
            res.status(201).json({ status: "success", message: "Invoice created successfully", data: newInvoice });
        } catch (error) {
            console.error("Error creating invoice:", error);
            res.status(500).json({ status: "error", message: "Error creating invoice", error: error.message });
        }
    },
];

// Update Invoice by ID
const updateInvoice = [
    body("customerName").optional().notEmpty().withMessage("Customer name cannot be empty"),
    body("email").optional().isEmail().withMessage("Email must be valid"),
    body("address").optional().notEmpty().withMessage("Address cannot be empty"),
    body("contact").optional().notEmpty().withMessage("Contact number cannot be empty"),
    body("receiptAdd").optional().notEmpty().withMessage("Receipt address cannot be empty"),
    body("cost").optional().isNumeric().withMessage("Cost must be a number"),
    body("weight").optional().isNumeric().withMessage("Weight must be a number"),
    body("quantity").optional().isNumeric().withMessage("Quantity must be a number"),
    async (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", errors: errors.array() });
        }

        try {
            const invoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
            if (!invoice) {
                return res.status(404).json({ status: "error", message: "Invoice not found" });
            }
            res.status(200).json({ status: "success", data: invoice });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Error updating invoice", error: error.message });
        }
    },
];

// Delete Invoice by ID
const deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findByIdAndDelete(id);
        if (!invoice) {
            return res.status(404).json({ status: "error", message: "Invoice not found" });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({ status: "error", message: "Error deleting invoice", error: error.message });
    }
};

export { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice };
