import Inventory from "../models/inventoryModel.js";

// Create a new inventory entry
export const createInventory = async (req, res) => {
    try {
        const newInventory = new Inventory(req.body);
        await newInventory.save();
        return res.status(201).json({ message: "Inventory created successfully", newInventory });
    } catch (err) {
        return res.status(400).json({ message: "Error creating inventory", error: err.message });
    }
};

// Get all inventory items
export const getAllInventory = async (req, res) => {
    try {
        const inventoryItems = await Inventory.find().populate("product");
        return res.status(200).json(inventoryItems);
    } catch (err) {
        return res.status(400).json({ message: "Error fetching inventory items", error: err.message });
    }
};

// Get an inventory item by ID
export const getInventoryById = async (req, res) => {
    try {
        const inventoryItem = await Inventory.findById(req.params.id).populate("product");
        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        return res.status(200).json(inventoryItem);
    } catch (err) {
        return res.status(400).json({ message: "Error fetching inventory item", error: err.message });
    }
};

// Update an inventory item
export const updateInventory = async (req, res) => {
    try {
        const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        return res.status(200).json({ message: "Inventory updated successfully", updatedInventory });
    } catch (err) {
        return res.status(400).json({ message: "Error updating inventory item", error: err.message });
    }
};

// Delete an inventory item
export const deleteInventory = async (req, res) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        return res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (err) {
        return res.status(400).json({ message: "Error deleting inventory item", error: err.message });
    }
};

// Check stock against reorder level and get products that need restocking
export const checkReorderLevel = async (req, res) => {
    try {
        const lowStockItems = await Inventory.find({ quantity: { $lt: { $remainder: "$reorderLevel" } } }).populate("product");
        return res.status(200).json(lowStockItems);
    } catch (err) {
        return res.status(400).json({ message: "Error checking reorder levels", error: err.message });
    }
};

/** DO NOT UNDO THE COMMENT YOU'LL SEE THE DEVIL
 * 
 * import Warehouse from "../models/warehouseModel.js";


export const createInventory = async (req, res) => {
    try {
        const { shipper, consignee, shipment, shipping, tracking_id, warehouse_id } = req.body;

        const warehouse = await Warehouse.findById(warehouse_id);
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        const newInventory = new Inventory({
            shipper,
            consignee,
            shipment,
            shipping,
            tracking_id,
            warehouse_id,
        });

        await newInventory.save();
        return res.status(201).json(newInventory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create inventory item", error: error.message });
    }
};

export const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find().populate("warehouse_id");
        return res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch inventory", error: error.message });
    }
};

export const getInventoryByTrackingId = async (req, res) => {
    try {
        const { tracking_id } = req.params;
        const inventory = await Inventory.findOne({ tracking_id }).populate("warehouse_id");
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found for this tracking ID" });
        }
        return res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch inventory by tracking ID", error: error.message });
    }
};

export const getInventoryByWarehouse = async (req, res) => {
    const { warehouse_id } = req.params;

    try {
        const warehouse = await Warehouse.findOne({ warehouse_id: warehouse_id });

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        const inventoryItems = await Inventory.find({ warehouse_id: warehouse._id }).populate("warehouse_id");

        if (inventoryItems.length === 0) {
            return res.status(404).json({ message: "No inventory linked to this warehouse" });
        }

        return res.status(200).json(inventoryItems);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to load inventory. Please try again." });
    }
};

export const updateInventoryByTrackingId = async (req, res) => {
    try {
        const { tracking_id } = req.params;
        const updates = req.body;

        const updatedInventory = await Inventory.findOneAndUpdate({ tracking_id }, updates, { new: true }).populate("warehouse_id");

        if (!updatedInventory) {
            return res.status(404).json({ message: "Inventory not found for this tracking ID" });
        }

        return res.status(200).json(updatedInventory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update inventory", error: error.message });
    }
};

export const deleteInventoryByTrackingId = async (req, res) => {
    try {
        const { tracking_id } = req.params;

        const deletedInventory = await Inventory.findOneAndDelete({ tracking_id });
        if (!deletedInventory) {
            return res.status(404).json({ message: "Inventory not found for this tracking ID" });
        }

        return res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete inventory", error: error.message });
    }
};
**/
