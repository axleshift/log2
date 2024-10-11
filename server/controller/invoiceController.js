import Invoice from '../models/invoiceModel.js'

// GET route to fetch all invoices
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
}

// GET single invoice by ID
const getInvoice = async (req, res) => {
    const { id } = req.params; // Ensure extract id from req.params
    try {
        const invoice = await Invoice.findById(id);
  
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
  
        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching invoice', error: error.message });
    }
}

// Create Invoice
const createInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        res.status(201).json({ status: 'success', message: 'Invoice created successfully', data: invoiceData });
        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();  // Save to the database
        res.status(201).json(newInvoice);  // Respond with the created invoice
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating invoice', error });
    }
}

// Update Invoice by ID
const updateInvoice = async (req, res) => {
    const { id } = req.params; // Ensure extract id from req.params
    try {
        const invoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true }); //{ new: true } to return the updated document
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Delete Invoice by ID
const deleteInvoice = async (req, res) => {
    const { id } = req.params; // Ensure extract id from req.params
    try {
        const invoice = await Invoice.findByIdAndDelete(id);
  
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
  
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export default {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice
};
