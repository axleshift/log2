import TrackingItem from "../models/trackingModel.js"; 
import { validationResult } from "express-validator";

// Create a tracking item
export const createTrackingItem = async (req, res) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); 
  }

  try {
    const newItem = new TrackingItem(req.body); // Use req.body to create a new item
    const savedItem = await newItem.save();
    console.log('Created tracking item:', savedItem);
    return res.status(201).json(savedItem); // Return the newly created item
  } catch (error) {
    console.error('Error creating tracking item:', error);
    return res.status(500).json({ error: 'Failed to create tracking item' });
  }
};

// Get all tracking items
export const getTrackingItems = async (req, res) => {
  try {
    const items = await TrackingItem.find(); // Fetch all tracking items
    console.log('Fetched tracking items:', items);
    return res.json(items); 
  } catch (error) {
    console.error('Error fetching tracking items:', error);
    return res.status(500).json({ error: 'Failed to fetch tracking items' });
  }
};

// Update a tracking item
export const updateTrackingItem = async (req, res) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); 
  }

  const { id } = req.params; // Get ID from request parameters
  try {
    const updatedItem = await TrackingItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Tracking item not found' });
    }
    return res.json(updatedItem); 
  } catch (error) {
    console.error('Error updating tracking item:', error);
    return res.status(500).json({ error: 'Failed to update tracking item' });
  }
};

// Delete a tracking item
export const deleteTrackingItem = async (req, res) => {
  const { id } = req.params; // Get ID from request parameters
  try {
    const deletedItem = await TrackingItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Tracking item not found' });
    }
    console.log('Deleted tracking item:', deletedItem);
    return res.sendStatus(204); 
  } catch (error) {
    console.error('Error deleting tracking item:', error);
    return res.status(500).json({ error: 'Failed to delete tracking item' });
  }
};
