import axios from 'axios'

const WAREHOUSE_API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/warehouse`
  : 'http://localhost:3001/api/warehouse'

const isValidResponse = (data) => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item &&
        typeof item._id === 'string' &&
        typeof item.productName === 'string' &&
        typeof item.productCategory === 'string' &&
        typeof item.vendorName === 'string' &&
        typeof item.unitsReceived === 'number',
    )
  )
}

const isValidItem = (item) => {
  console.log('Validating item:', item) // Log the item being validated
  return (
    item &&
    typeof item.productName === 'string' &&
    typeof item.productCategory === 'string' &&
    typeof item.vendorName === 'string' &&
    typeof item.unitsReceived === 'number'
  ) // _id is not needed for new items
}

export const getWarehouseItems = async () => {
  try {
    const response = await axios.get(WAREHOUSE_API_URL)
    console.log('Fetched items:', response.data)
    if (!isValidResponse(response.data)) {
      throw new Error('Invalid data structure received')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching warehouse items:', error)
    throw new Error('Failed to fetch warehouse items')
  }
}

export const createWarehouseItem = async (data) => {
  try {
    console.log('Creating item with data:', data) // Log the data being sent
    const response = await axios.post(WAREHOUSE_API_URL, data)
    console.log('Created item response:', response.data) // Log the response from the server
    if (!isValidItem(response.data)) {
      throw new Error('Invalid item structure received')
    }
    return response.data
  } catch (error) {
    console.error('Error creating warehouse item:', error)
    throw new Error('Failed to create warehouse item')
  }
}

export const updateWarehouseItem = async (id, data) => {
  try {
    console.log('Updating item with id:', id, 'and data:', data) // Log the id and data
    const response = await axios.put(`${WAREHOUSE_API_URL}/${id}`, data)
    if (!isValidItem(response.data)) {
      throw new Error('Invalid item structure received')
    }
    return response.data
  } catch (error) {
    console.error('Error updating warehouse item:', error)
    throw new Error('Failed to update warehouse item')
  }
}

export const deleteWarehouseItem = async (id) => {
  try {
    console.log('Deleting item with id:', id) // Log the id being deleted
    await axios.delete(`${WAREHOUSE_API_URL}/${id}`)
  } catch (error) {
    console.error('Error deleting warehouse item:', error)
    throw new Error('Failed to delete warehouse item')
  }
}
