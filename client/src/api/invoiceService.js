import axios from 'axios'

const API_URL = 'http://localhost:3001/api/invoice'

export const getInvoices = async () => {
  try {
    const response = await axios.get(API_URL)
    return response // Return the full response, not just response.data
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw error
  }
}

export const createInvoice = async (data) => {
  try {
    const response = await axios.post(API_URL, data)
    return response.data
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const deleteInvoice = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting invoice:', error)
    throw error // Rethrow to handle it in the component
  }
}
