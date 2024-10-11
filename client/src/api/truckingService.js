import axios from 'axios'

const API_URL = 'http://localhost:3001/api/trucking'

export const getTruckingItems = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data // Return only the data
  } catch (error) {
    console.error('Error fetching trucking items:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const createTruckingItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData)
    return response.data // Return the newly created item
  } catch (error) {
    console.error('Error creating trucking item:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const updateTruckingItem = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data)
    return response.data // Return the updated item
  } catch (error) {
    console.error('Error updating trucking item:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const deleteTruckingItem = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    return { message: 'Item deleted successfully' } // Optional confirmation message
  } catch (error) {
    console.error('Error deleting trucking item:', error)
    throw error // Rethrow to handle it in the component
  }
}
