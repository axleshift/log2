import Warehouse from "../models/warehouseModel.js";

export const createWarehouse = async (req, res) => {
    try {
        const { warehouse_id, name, location, capacity, type_of_goods } = req.body;

        const newWarehouse = new Warehouse({
            warehouse_id,
            name,
            location,
            capacity,
            type_of_goods,
        });

        await newWarehouse.save();
        return res.status(201).json(newWarehouse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        return res.status(200).json(warehouses);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getWarehouseById = async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const warehouse = await Warehouse.findOne({ warehouse_id });

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        return res.status(200).json(warehouse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateWarehouseById = async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const updates = req.body;

        const updatedWarehouse = await Warehouse.findOneAndUpdate({ warehouse_id }, updates, { new: true });

        if (!updatedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        return res.status(200).json(updatedWarehouse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteWarehouseById = async (req, res) => {
    try {
        const { warehouse_id } = req.params;

        const deletedWarehouse = await Warehouse.findOneAndDelete({ warehouse_id });
        if (!deletedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        return res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
