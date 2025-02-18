import Shipment from "../models/shipment.js";

/**
 * Create a new shipment
 */
export const createShipment = async (req, res) => {
    try {
        const shipment = new Shipment(req.body);
        await shipment.save();
        res.status(201).json({ success: true, message: "Shipment created successfully", shipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Get all shipments
 */
export const getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find();
        res.status(200).json({ success: true, shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get a single shipment by ID
 */
export const getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });

        res.status(200).json({ success: true, shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update shipment details
 */
export const updateShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });

        res.status(200).json({ success: true, message: "Shipment updated successfully", shipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Delete a shipment
 */
export const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndDelete(req.params.id);
        if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });

        res.status(200).json({ success: true, message: "Shipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
