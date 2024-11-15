import Inventory from "../models/inventoryModel.js";

// Get all inventories
export const getInventories = async (req, res) => {
    try {
        const { search } = req.query;

        const query = search
            ? {
                  $or: [{ "shipment.shipment_description": { $regex: search, $options: "i" } }, { tracking_id: { $regex: search, $options: "i" } }],
              }
            : {};

        const inventories = await Inventory.find(query);

        if (inventories.length === 0) {
            return res.status(200).json({ message: "No inventories found." });
        }

        res.status(200).json(inventories);
    } catch (error) {
        console.error("Error fetching inventories:", error);
        res.status(500).json({ message: "Error fetching inventories." });
    }
};

// Get a specific inventory by tracking_id
export const getInventory = async (req, res) => {
    try {
        const { tracking_id } = req.params; // Use tracking_id from params
        console.log("Fetching inventory for tracking_id:", tracking_id);

        const inventory = await Inventory.findOne({ tracking_id });

        if (!inventory) {
            console.log("Inventory not found:", tracking_id);
            return res.status(404).json({ message: "Inventory not found." });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        res.status(500).json({ message: "Error fetching inventory data." });
    }
};

// Create a new inventory
export const createInventory = async (req, res) => {
    try {
        const newInventory = new Inventory(req.body);

        // Optional: Validate the body content before saving
        if (!newInventory.tracking_id || !newInventory.shipment) {
            return res.status(400).json({ message: "Missing required fields: tracking_id or shipment data." });
        }

        await newInventory.save();
        res.status(201).json(newInventory);
    } catch (error) {
        console.error("Error creating inventory:", error);
        res.status(400).json({ message: error.message });
    }
};

// Update an inventory by tracking_id
export const updateInventory = async (req, res) => {
    try {
        const { tracking_id } = req.params;
        const updatedInventory = await Inventory.findOneAndUpdate(
            { tracking_id }, // Use tracking_id to search for inventory
            req.body,
            { new: true }
        );

        if (!updatedInventory) {
            return res.status(404).json({ message: "Inventory not found." });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a single inventory by tracking_id
export const deleteInventory = async (req, res) => {
    try {
        const { tracking_id } = req.params;
        const deletedInventory = await Inventory.findOneAndDelete({ tracking_id });

        if (!deletedInventory) {
            return res.status(404).json({ message: "Inventory not found." });
        }

        res.status(200).json({ message: "Inventory deleted successfully." });
    } catch (error) {
        console.error("Error deleting inventory:", error);
        res.status(500).json({ message: "Error deleting inventory." });
    }
};

// Delete multiple inventories
export const deleteMultipleInventories = async (req, res) => {
    try {
        const { ids } = req.body;

        console.log("Received IDs for deletion:", ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No valid IDs provided for deletion." });
        }

        // Ensure the IDs are strings and valid
        const validIds = ids.map((id) => String(id));

        const result = await Inventory.deleteMany({
            tracking_id: { $in: validIds },
        });

        console.log("Deleted Count:", result.deletedCount);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No inventories found with the provided IDs." });
        }

        res.status(200).json({ message: `${result.deletedCount} inventories deleted successfully.` });
    } catch (error) {
        console.error("Error deleting selected inventories:", error);
        res.status(500).json({ message: "Error deleting selected inventories." });
    }
};
