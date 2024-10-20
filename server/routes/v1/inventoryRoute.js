import express from "express";
const router = express.Router();

import inventoryController from "../../controller/InventoryController.js";

router.get("/", inventoryController.getAllShipments); // Fetch all shipments
router.get("/:id", inventoryController.getShipmentById); // Fetch a shipment by ID
router.put("/:id", inventoryController.updateShipment); // Update a shipment by ID
router.delete("/:id", inventoryController.deleteShipment); // Delete a shipment by ID

export default router;
