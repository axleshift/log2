import express from "express";
import Inventory from "../models/inventoryModel.js";

const router = express.Router();

// Generate inventory report
router.get("/", async (req, res) => {
    try {
        const items = await Inventory.find();
        const totalItems = items.length;
        const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ totalItems, totalQuantity });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
