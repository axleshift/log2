import express from 'express';
import invoiceController from '../controller/invoiceController.js';

const router = express.Router();

// Destructure the controller methods for clarity
const {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice
} = invoiceController;

// Route to fetch all invoices
router.get('/', getInvoices);

// Route to fetch a single invoice by ID
router.get('/:id', getInvoice);

// Route to create a new invoice
router.post('/', createInvoice); 

// Route to update an existing invoice by ID
router.put('/:id', updateInvoice); 

// Route to delete an invoice by ID
router.delete('/:id', deleteInvoice);

export default router;
