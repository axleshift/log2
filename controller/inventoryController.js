import Inventory from "../models/inventoryModel.js";
import Warehouse from "../models/warehouseModel.js";

// Fetch all inventories (with optional search)
export const getInventories = async (req, res) => {
    const { search } = req.query;

    try {
        const query = search
            ? {
                  $or: [{ "shipment.shipment_description": { $regex: search, $options: "i" } }, { tracking_id: { $regex: search, $options: "i" } }],
              }
            : {};

        const inventories = await Inventory.find(query).populate("warehouse");

        if (inventories.length === 0) {
            return res.status(200).json({ message: "No inventories found." });
        }

        res.status(200).json(inventories);
    } catch (error) {
        console.error("Error fetching inventories:", error);
        return res.status(500).json({ message: "Server error.", error });
    }
};

// Fetch a specific inventory by tracking_id
export const getInventoryByTrackingId = async (req, res) => {
    const { tracking_id } = req.params;

    try {
        const inventory = await Inventory.findOne({ tracking_id }).populate("warehouse");

        if (!inventory) {
            return res.status(404).json({ message: `Inventory with tracking ID '${tracking_id}' not found.` });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error("Error fetching inventory by tracking ID:", error);
        return res.status(500).json({ message: "Server error.", error });
    }
};

// Create a new inventory
export const createInventory = async (req, res) => {
    const { tracking_id, warehouse_id, shipment } = req.body;

    if (!tracking_id || !shipment || !warehouse_id) {
        return res.status(400).json({ message: "Missing required fields: tracking_id, shipment, or warehouse_id." });
    }

    try {
        const existingInventory = await Inventory.findOne({ tracking_id });
        if (existingInventory) {
            return res.status(400).json({ message: "Inventory with this tracking ID already exists." });
        }

        const newInventory = new Inventory({
            tracking_id,
            warehouse: warehouse_id, // Linking inventory to warehouse
            shipment,
        });

        await newInventory.save();

        const warehouse = await Warehouse.findOneAndUpdate(
            { warehouse_id },
            { $push: { inventory: newInventory._id } }, // Add the new inventory to warehouse's inventory array
            { new: true }
        );

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found to link inventory." });
        }

        res.status(201).json(newInventory);
    } catch (error) {
        console.error("Error creating inventory:", error);
        return res.status(500).json({ message: "Server error.", error });
    }
};

// Update an inventory by tracking_id
export const updateInventoryByTrackingId = async (req, res) => {
    const { tracking_id } = req.params;
    const { shipment, warehouse_id } = req.body;

    if (!shipment || !warehouse_id) {
        return res.status(400).json({ message: "Missing required fields: shipment or warehouse_id." });
    }

    try {
        const updatedInventory = await Inventory.findOneAndUpdate({ tracking_id }, { shipment, warehouse: warehouse_id }, { new: true, runValidators: true });

        if (!updatedInventory) {
            return res.status(404).json({ message: `Inventory with tracking ID '${tracking_id}' not found.` });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        console.error("Error updating inventory by tracking ID:", error);
        return res.status(500).json({ message: "Server error.", error });
    }
};

// Delete a single inventory by tracking_id
export const deleteInventoryByTrackingId = async (req, res) => {
    const { tracking_id } = req.params;

    try {
        const inventory = await Inventory.findOneAndDelete({ tracking_id });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        // Remove the inventory from the warehouse's inventory list
        await Warehouse.findOneAndUpdate({ _id: inventory.warehouse }, { $pull: { inventory: inventory._id } });

        res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (err) {
        console.error("Error deleting inventory:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
