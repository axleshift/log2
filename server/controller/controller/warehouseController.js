import Warehouse from "../models/warehouseModel.js";

// Create a new warehouse
export const createWarehouse = async (req, res) => {
    try {
        const { warehouse_id, name, location, capacity, goods_stored } = req.body;

        const existingWarehouse = await Warehouse.findOne({ $or: [{ warehouse_id }, { name }] });
        if (existingWarehouse) {
            return res.status(400).json({ message: "Warehouse with this warehouse_id or name already exists" });
        }

        const newWarehouse = new Warehouse({
            warehouse_id,
            name,
            location,
            capacity,
            goods_stored,
        });

        await newWarehouse.save();

        res.status(201).json(newWarehouse);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();

        res.status(200).json(warehouses);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findOne({ warehouse_id: req.params.warehouse_id });

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json(warehouse);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Update a warehouse by warehouse_id
export const updateWarehouse = async (req, res) => {
    try {
        const { name, location, capacity, goods_stored } = req.body;

        const existingWarehouse = await Warehouse.findOne({
            $or: [{ name }],
            _id: { $ne: req.params.id },
        });

        if (existingWarehouse) {
            return res.status(400).json({ message: "Warehouse with this name already exists" });
        }

        const updatedWarehouse = await Warehouse.findOneAndUpdate({ warehouse_id: req.params.warehouse_id }, { name, location, capacity, goods_stored }, { new: true, runValidators: true });

        if (!updatedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json(updatedWarehouse);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete a warehouse by warehouse_id
export const deleteWarehouse = async (req, res) => {
    try {
        const deletedWarehouse = await Warehouse.findOneAndDelete({ warehouse_id: req.params.warehouse_id });

        if (!deletedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
