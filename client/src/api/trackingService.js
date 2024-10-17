import axios from 'axios';

const TRACKING_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/tracking`;

const trackingAxiosInstance = axios.create({
  baseURL: TRACKING_API_URL,
  timeout: 10000,
});

// Validation function for tracking items
const isValidTrackingItem = (item) => {
  console.log('Validating tracking item:', item);
  return (
    item &&
    typeof item.customerName === 'string' &&  
    typeof item.email === 'string' &&
    typeof item.billingAddress === 'string' &&
    typeof item.contactNumber === 'string' &&
    typeof item.recipientAddress === 'string' &&
    typeof item.weight === 'number' &&
    typeof item.paidAmount === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.status === 'string' 
  );
};

// Create a tracking item
export const createTrackingItem = async (data) => {
  try {
    console.log('Creating tracking item with data:', data);
    const response = await trackingAxiosInstance.post('', data);
    console.log('Created tracking item response:', response.data);
    
    if (!isValidTrackingItem(response.data)) {
      throw new Error('Invalid tracking item structure received');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating tracking item:', error);
    throw new Error('Failed to create tracking item');
  }
};

export const getTrackingItems = async () => {
  try {
    const response = await trackingAxiosInstance.get('');
    return response.data; 
  } catch (error) {
    console.error('Error fetching tracking items:', error);
    throw new Error('Failed to fetch tracking items');
  }
};

export const updateTrackingItem = async (id, data) => {
  try {
    const response = await trackingAxiosInstance.put(`/${id}`, data);
    if (!isValidTrackingItem(response.data)) {
      throw new Error('Invalid tracking item structure received');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating tracking item:', error);
    throw new Error('Failed to update tracking item');
  }
};

export const deleteTrackingItem = async (id) => {
  try {
    await trackingAxiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error('Error deleting tracking item:', error);
    throw new Error('Failed to delete tracking item');
  }
};
