import Warehouse from "../models/warehouseModel.js";

// Fetch inventory by warehouse_id
export const getInventoryByWarehouseId = async (req, res) => {
    const { warehouse_id } = req.params;

    try {
        const warehouse = await Warehouse.findOne({ warehouse_id }).populate("inventory");
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found." });
        }

        if (!warehouse.inventory || warehouse.inventory.length === 0) {
            return res.status(404).json({ message: "No inventory linked to this warehouse." });
        }

        return res.status(200).json(warehouse.inventory);
    } catch (err) {
        console.error("Error fetching inventory by warehouse_id:", err);
        return res.status(500).json({ message: "Server error.", error: err });
    }
};

// Create a new warehouse
export const createWarehouse = async (req, res) => {
    try {
        const { warehouse_id, name, location, capacity, inventory } = req.body;

        const existingWarehouse = await Warehouse.findOne({
            $or: [{ warehouse_id }, { name }],
        });
        if (existingWarehouse) {
            return res.status(400).json({ message: "Warehouse with this warehouse_id or name already exists" });
        }

        const newWarehouse = new Warehouse({
            warehouse_id,
            name,
            location,
            capacity,
            inventory,
        });

        await newWarehouse.save();

        res.status(201).json(newWarehouse);
    } catch (err) {
        console.error("Error creating warehouse:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get all warehouses
export const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find().populate("inventory"); // populate inventory
        res.status(200).json(warehouses);
    } catch (err) {
        console.error("Error fetching warehouses:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get a single warehouse by warehouse_id
export const getWarehouseById = async (req, res) => {
    try {
        const { warehouse_id } = req.params;

        const warehouse = await Warehouse.findOne({ warehouse_id }).populate("inventory");

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json(warehouse);
    } catch (err) {
        console.error("Error fetching warehouse by ID:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Update a warehouse by warehouse_id
export const updateWarehouse = async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const { name, location, capacity, inventory } = req.body;

        const existingWarehouse = await Warehouse.findOne({
            name,
            warehouse_id: { $ne: warehouse_id }, // Exclude current warehouse from the check
        });

        if (existingWarehouse) {
            return res.status(400).json({ message: "Warehouse with this name already exists" });
        }

        // Update the warehouse details
        const updatedWarehouse = await Warehouse.findOneAndUpdate({ warehouse_id }, { name, location, capacity, inventory }, { new: true, runValidators: true });

        if (!updatedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json(updatedWarehouse);
    } catch (err) {
        console.error("Error updating warehouse:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete a warehouse by warehouse_id
export const deleteWarehouse = async (req, res) => {
    try {
        const { warehouse_id } = req.params;

        const warehouse = await Warehouse.findOneAndDelete({ warehouse_id });

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (err) {
        console.error("Error deleting warehouse:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
