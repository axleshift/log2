import Inventory from "../models/inventoryModel.js";

// Create Inventory
export const createInventory = async (req, res) => {
    try {
        const { shipment, warehouse_id, product, sku, quantity, stock_level, status } = req.body;

        const newInventory = new Inventory({
            shipment,
            warehouse_id,
            product,
            sku,
            quantity,
            stock_level,
            status,
        });

        const savedInventory = await newInventory.save();
        res.status(201).json(savedInventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Inventory Records
export const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find().populate("shipment", "tracking_id").populate("warehouse_id", "location").populate("product", "itemName");

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Inventory by ID
export const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate("shipment", "tracking_id").populate("warehouse_id", "location").populate("product", "itemName");

        if (!inventory) return res.status(404).json({ message: "Inventory not found" });

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Inventory Stock Level
export const updateInventory = async (req, res) => {
    try {
        const { quantity, stock_level, status } = req.body;
        const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, { quantity, stock_level, status }, { new: true });

        if (!updatedInventory) return res.status(404).json({ message: "Inventory not found" });

        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Inventory Record
export const deleteInventory = async (req, res) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);

        if (!deletedInventory) return res.status(404).json({ message: "Inventory not found" });

        res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
