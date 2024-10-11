import axios from 'axios'

const API_URL = 'http://localhost:3001/api/warehouse'

export const getWarehouseItems = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data // Return only the data
  } catch (error) {
    console.error('Error fetching warehouse items:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const createWarehouseItem = async (data) => {
  try {
    const response = await axios.post(API_URL, data)
    return response.data
  } catch (error) {
    console.error('Error creating warehouse item:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const updateWarehouseItem = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating warehouse item:', error)
    throw error // Rethrow to handle it in the component
  }
}

export const deleteWarehouseItem = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`) // No need to return data here
  } catch (error) {
    console.error('Error deleting warehouse item:', error)
    throw error // Rethrow to handle it in the component
  }
}
