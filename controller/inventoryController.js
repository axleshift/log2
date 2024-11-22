import Inventory from "../models/inventoryModel.js";
import Warehouse from "../models/warehouseModel.js";

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
