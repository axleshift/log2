import WarehouseItem from "../models/warehouseModel.js"; // Import your model

// Get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await WarehouseItem.find(); // Assuming you're using Mongoose
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Failed to fetch items." });
    }
};

// Create a new item
export const createItem = async (req, res) => {
    try {
        const newItem = new WarehouseItem(req.body); // Assuming body contains valid item data
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
        const updatedItem = await WarehouseItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedItem = await WarehouseItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found." });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Failed to delete item." });
    }
};

// Example validation middleware (simplified)
export const validateItem = (req, res, next) => {
    const { productName, productCategory, vendorName, unitsReceived } = req.body;
    if (!productName || !productCategory || !vendorName || typeof unitsReceived !== "number") {
        return res.status(400).json({ message: "Invalid item structure received." });
    }
    next();
};
