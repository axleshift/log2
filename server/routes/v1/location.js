import express from "express";
import Location from "../../models/Location.js";

const router = express.Router();
// Get locations by warehouseId
router.get("/", async (req, res) => {
    const { warehouseId } = req.query;

    try {
        const locations = await Location.find({ warehouseId });
        res.json(locations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a new location
router.post("/", async (req, res) => {
    const { warehouseId, row, shelf } = req.body;

    try {
        const newLocation = new Location({ warehouseId, row, shelf });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
