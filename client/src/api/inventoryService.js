import axios from 'axios'

const INVENTORY_API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/inventory`
  : 'http://localhost:3001/api/inventory'

const handleError = (error) => {
  const message = error.response?.data?.message || 'Something went wrong'
  console.error('API Error:', message, error)
  throw new Error(message)
}

export const getInventoryItems = async () => {
  try {
    const response = await axios.get(INVENTORY_API_URL)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const createInventoryItem = async (item) => {
  try {
    const response = await axios.post(INVENTORY_API_URL, item)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const updateInventoryItem = async (id, item) => {
  try {
    const response = await axios.put(`${INVENTORY_API_URL}/${id}`, item)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const deleteInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${INVENTORY_API_URL}/${id}`)
    return response.data // Optionally return a success message or the deleted item
  } catch (error) {
    handleError(error)
  }
}
