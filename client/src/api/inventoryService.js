import axios from 'axios'

const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

const inventoryAxiosInstance = axios.create({
  baseURL: INVENTORY_API_URL,
  timeout: 10000,
})

const isValidResponse = (data) => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item &&
        typeof item._id === 'string' &&
        typeof item.productName === 'string' &&
        typeof item.quantity === 'number' &&
        typeof item.price === 'number' &&
        typeof item.total === 'number',
    )
  )
}

const isValidItem = (item) => {
  console.log('Validating inventory item:', item) // Log the item being validated
  return (
    item &&
    typeof item.productName === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.price === 'number' &&
    typeof item.total === 'number'
  )
}

export const getInventoryItems = async () => {
  try {
    const response = await inventoryAxiosInstance.get() // Use the axios instance
    console.log('Fetched inventory items:', response.data)
    if (!isValidResponse(response.data)) {
      throw new Error('Invalid data structure received')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    throw new Error('Failed to fetch inventory items')
  }
}

export const createInventoryItem = async (data) => {
  try {
    console.log('Creating inventory item with data:', data) // Log the data being sent
    const response = await inventoryAxiosInstance.post('', data)
    console.log('Created inventory item response:', response.data) // Log the response from the server
    if (!isValidItem(response.data)) {
      throw new Error('Invalid inventory item structure received')
    }
    return response.data
  } catch (error) {
    console.error('Error creating inventory item:', error)
    throw new Error('Failed to create inventory item')
  }
}

export const updateInventoryItem = async (id, data) => {
  try {
    console.log('Updating inventory item with id:', id, 'and data:', data) // Log the id and data
    const response = await inventoryAxiosInstance.put(`/${id}`, data)
    if (!isValidItem(response.data)) {
      throw new Error('Invalid inventory item structure received')
    }
    return response.data
  } catch (error) {
    console.error('Error updating inventory item:', error)
    throw new Error('Failed to update inventory item')
  }
}

export const deleteInventoryItem = async (id) => {
  try {
    console.log('Deleting inventory item with id:', id) // Log the id being deleted
    await inventoryAxiosInstance.delete(`/${id}`)
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    throw new Error('Failed to delete inventory item')
  }
}
