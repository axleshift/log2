import Inventory from '../models/inventoryModel.js'; 

// Get all inventories
export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single inventory by tracking_id
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ tracking_id: req.params.id });
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new inventory
export const createInventory = async (req, res) => {
  const newInventory = new Inventory(req.body);
  try {
    await newInventory.save();
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an inventory by tracking_id
export const updateInventory = async (req, res) => {
  try {
    const updatedInventory = await Inventory.findOneAndUpdate(
      { tracking_id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedInventory) return res.status(404).json({ message: "Inventory not found" });
    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an inventory by tracking_id
export const deleteInventory = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findOneAndDelete({ tracking_id: req.params.id });
    if (!deletedInventory) return res.status(404).json({ message: "Inventory not found" });
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
