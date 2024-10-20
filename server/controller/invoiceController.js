import Invoice from "../models/invoiceModel.js";

export const createInvoice = async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        res.status(201).send(invoice);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).send(invoices);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).send("Invoice not found");
        res.status(200).send(invoice);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!invoice) return res.status(404).send("Invoice not found");
        res.status(200).send(invoice);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).send("Invoice not found");
        res.status(200).send("Invoice deleted successfully");
    } catch (error) {
        res.status(500).send(error);
    }
};
