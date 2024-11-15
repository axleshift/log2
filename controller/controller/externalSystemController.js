import express from "express";

export const getItemDetails = async (req, res) => {
    const trackingId = req.params.tracking_id;

    try {
        const itemDetails = {
            name: "Product A",
            quantity: 100,
            price: 20.0,
        };

        res.json(itemDetails);
    } catch (error) {
        console.error("Error fetching item details:", error);
        res.status(500).json({ error: "Failed to fetch item details" });
    }
};
