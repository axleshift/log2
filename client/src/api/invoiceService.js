import axios from 'axios';

const INVOICE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/invoice`;

const invoiceAxiosInstance = axios.create({
  baseURL: INVOICE_API_URL,
  timeout: 10000,
});

// Validation for response structure
const isValidInvoiceResponse = (data) => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item &&
        typeof item._id === 'string' &&
        typeof item.customerName === 'string' &&
        typeof item.email === 'string' &&
        typeof item.address === 'string' &&
        typeof item.contact === 'string' &&
        typeof item.receiptAdd === 'string' &&
        typeof item.cost === 'number' &&
        typeof item.weight === 'number' &&
        typeof item.quantity === 'number'
    )
  );
};

// Validation for single invoice item
const isValidInvoiceItem = (item) => {
  return (
    item &&
    typeof item.customerName === 'string' &&
    typeof item.email === 'string' &&
    typeof item.address === 'string' &&
    typeof item.contact === 'string' &&
    typeof item.receiptAdd === 'string' &&
    typeof item.cost === 'number' &&
    typeof item.weight === 'number' &&
    typeof item.quantity === 'number'
  );
};

// Get all invoices
export const getInvoices = async () => {
    try {
      const response = await invoiceAxiosInstance.get();
      const invoices = response.data.data; // Access the nested data
      console.log('Invoices data:', invoices); 
      if (!isValidInvoiceResponse(invoices)) {
        throw new Error('Invalid data structure received');
      }
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  };


// Create a new invoice
export const createInvoice = async (data) => {
    try {
      const response = await invoiceAxiosInstance.post('', data);
      const responseData = response.data.data; // Adjust based on actual response structure
      if (!isValidInvoiceItem(responseData)) {
        throw new Error('Invalid invoice item structure received');
      }
      return responseData;
    } catch (error) {
      console.error('Error creating invoice:', error.response ? error.response.data : error);
      throw new Error('Failed to create invoice');
    }
  };
  

// Update an existing invoice
export const updateInvoice = async (id, data) => {
  try {
    const response = await invoiceAxiosInstance.put(`/${id}`, data);
    if (!isValidInvoiceItem(response.data)) {
      throw new Error('Invalid invoice item structure received');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw new Error('Failed to update invoice');
  }
};

// Delete an invoice
export const deleteInvoice = async (id) => {
  try {
    await invoiceAxiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error('Failed to delete invoice');
  }
};
