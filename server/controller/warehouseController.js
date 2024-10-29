import Warehouse from "../models/warehouseModel.js";

// Create a new warehouse
export const createWarehouse = async (req, res) => {
    try {
        const warehouse = new Warehouse(req.body);
        await warehouse.save();
        res.status(201).json({ message: "Warehouse created successfully", warehouse });
    } catch (error) {
        res.status(400).json({ message: "Error creating warehouse", error });
    }
};

// Get all warehouses
export const getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(400).json({ message: "Error fetching warehouses", error });
    }
};

// Get a single warehouse by ID
export const getWarehouseById = async (req, res) => {
    const { id } = req.params; // Accessing the ID from the parameters

    console.log("Fetching warehouse with ID:", id);
    try {
        const warehouse = await Warehouse.findOne({ warehouse_id: id });
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }
        res.status(200).json({ message: "Warehouse Fetch Successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error fetching warehouse", error });
    }
};

// Update warehouse by ID
export const updateWarehouseById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedWarehouse = await Warehouse.findOneAndUpdate(
            { warehouse_id: id }, // Query by warehouse_id
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json({ message: "Warehouse Updated Successfully" });
    } catch (error) {
        console.error("Error updating warehouse", error);
        return res.status(500).json({ message: "Error updating warehouse", error });
    }
};

// Delete a warehouse by ID
export const deleteWarehouseById = async (req, res) => {
    const { id } = req.params; // Get the warehouse_id from the parameters

    try {
        const warehouse = await Warehouse.findOneAndDelete({ warehouse_id: id });
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }
        res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting warehouse", error });
    }
};
