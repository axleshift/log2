import InventoryItem from "../models/inventoryModel.js";

// Get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await InventoryItem.find();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Failed to fetch items." });
    }
};

// Create a new item
export const createItem = async (req, res) => {
    try {
        const newItem = new InventoryItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(400).json({ message: "Failed to create item." });
    }
};

// Update an item
export const updateItem = async (req, res) => {
    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found." });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(400).json({ message: "Failed to update item." });
    }
};

// Delete an item
export const deleteItem = async (req, res) => {
    try {
        const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found." });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Failed to delete item." });
    }
};

// Validation middleware
export const validateItem = (req, res, next) => {
    const { productName, quantity, price, total } = req.body;
    if (!productName || typeof quantity !== "number" || typeof price !== "number" || typeof total !== "number") {
        return res.status(400).json({ message: "Invalid item structure received." });
    }
    next();
};
