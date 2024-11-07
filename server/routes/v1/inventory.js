import express from 'express';
import { 
  getInventories, 
  getInventoryById, 
  createInventory, 
  updateInventory, 
  deleteInventory 
} from '../../controllers/inventoryController.js'; 

const router = express.Router();

// GET all inventories
router.get('/inventories', getInventories);

// GET a single inventory by tracking_id
router.get('/inventories/:id', getInventoryById);

// POST a new inventory
router.post('/inventories', createInventory);

// PUT update an inventory by tracking_id
router.put('/inventories/:id', updateInventory);

// DELETE an inventory by tracking_id
router.delete('/inventories/:id', deleteInventory);

export default router;
