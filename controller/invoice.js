import Invoice from "../models/invoice.js";
import PurchaseOrder from "../models/purchaseOrder.js";

// Create Invoice
export const createInvoice = async (req, res) => {
    try {
        const { purchaseOrderId, amountDue, amountPaid } = req.body;

        const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        const invoice = new Invoice({
            purchaseOrderId,
            amountDue,
            amountPaid,
            status: amountPaid >= amountDue ? "Paid" : "Pending",
        });

        await invoice.save();
        res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all Invoices
export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("purchaseOrderId");
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("purchaseOrderId");
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Invoice
export const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        Object.assign(invoice, req.body);
        invoice.status = invoice.amountPaid >= invoice.amountDue ? "Paid" : "Pending";

        await invoice.save();
        res.status(200).json({ message: "Invoice updated successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Invoice Payment Status
export const updateInvoicePayment = async (req, res) => {
    try {
        const { amountPaid } = req.body;
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        invoice.amountPaid = amountPaid;
        invoice.status = invoice.amountPaid >= invoice.amountDue ? "Paid" : "Pending";

        await invoice.save();
        res.status(200).json({ message: "Invoice payment updated successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
