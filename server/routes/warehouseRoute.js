import express from 'express';
import { getAllItems, createItem, updateItem, deleteItem } from '../controller/warehouseController.js';

const router = express.Router();

// Get all warehouse items
router.get('/', getAllItems); // This will match GET /api/warehouse

// Create a new warehouse item
router.post('/', createItem); // This will match POST /api/warehouse

// Update a warehouse item
router.put('/:id', updateItem); // This will match PUT /api/warehouse/:id

// Delete a warehouse item
router.delete('/:id', deleteItem); // This will match DELETE /api/warehouse/:id

export default router;
