import Logistics from "../models/logisticsModel.js";

export const createLogistics = async (req, res) => {
    try {
        const logistics = new Logistics(req.body);
        await logistics.save();
        res.status(201).json({ message: "Logistics entry created successfully", logistics });
    } catch (error) {
        console.error("Error creating logistics entry:", error);
        res.status(400).json({ message: "Error creating logistics entry", error: error.message });
    }
};

// Get all logistics
export const getLogistics = async (req, res) => {
    try {
        const logistics = await Logistics.find();
        res.status(200).json(logistics);
    } catch (error) {
        console.error("Error fetching logistics entries:", error);
        res.status(400).json({ message: "Error fetching logistics entries", error: error.message });
    }
};

// Get Logistics Record by Tracking ID
export const getLogisticsById = async (req, res) => {
    const { id: tracking_id } = req.params;

    console.log("Fetching logistics entry with tracking_id:", tracking_id);
    try {
        const logisticsEntry = await Logistics.findOne({
            $or: [{ "incomingShipment.tracking_id": tracking_id }, { "outgoingShipment.tracking_id": tracking_id }],
        });

        if (!logisticsEntry) {
            console.warn("Logistics entry not found for tracking_id:", tracking_id);
            return res.status(404).json({ message: "Logistics entry not found" });
        }
        res.status(200).json(logisticsEntry);
    } catch (error) {
        console.error("Error fetching logistics entry:", error);
        res.status(400).json({ message: "Error fetching logistics entry", error: error.message });
    }
};

// Update a logistics entry by Tracking ID
export const updateLogisticsById = async (req, res) => {
    const { id: tracking_id } = req.params;
    const updates = req.body;

    console.log("Updating logistics entry with tracking_id:", tracking_id);
    console.log("Updates:", updates);

    try {
        const updateOperation = { $set: {} };

        if (updates.incomingShipment) {
            const incomingUpdateFields = Object.keys(updates.incomingShipment);
            incomingUpdateFields.forEach((field) => {
                updateOperation.$set[`incomingShipment.${field}`] = updates.incomingShipment[field];
            });
        }

        if (updates.outgoingShipment) {
            const outgoingUpdateFields = Object.keys(updates.outgoingShipment);
            outgoingUpdateFields.forEach((field) => {
                updateOperation.$set[`outgoingShipment.${field}`] = updates.outgoingShipment[field];
            });
        }

        const logistics = await Logistics.findOne({
            $or: [{ "incomingShipment.tracking_id": tracking_id }, { "outgoingShipment.tracking_id": tracking_id }],
        });

        if (!logistics) {
            console.warn("Logistics entry not found for tracking_id:", tracking_id);
            return res.status(404).json({ message: "Logistics entry not found" });
        }

        if (logistics.incomingShipment.tracking_id === tracking_id && updates.incomingShipment) {
            Object.keys(updates.incomingShipment).forEach((field) => {
                logistics.incomingShipment[field] = updates.incomingShipment[field];
            });
        }

        if (logistics.outgoingShipment.tracking_id === tracking_id && updates.outgoingShipment) {
            Object.keys(updates.outgoingShipment).forEach((field) => {
                logistics.outgoingShipment[field] = updates.outgoingShipment[field];
            });
        }

        // Save the updated logistics entry
        await logistics.save();

        res.status(200).json({ message: "Logistics entry updated successfully", logistics });
    } catch (error) {
        console.error("Error updating logistics entry:", error);
        res.status(400).json({
            message: "Error updating logistics entry",
            error: error.message || error,
        });
    }
};

// Delete a logistics entry by Tracking ID
export const deleteLogisticsById = async (req, res) => {
    const { id: tracking_id } = req.params;

    console.log("Deleting logistics entry with tracking_id:", tracking_id);
    try {
        const logistics = await Logistics.findOneAndDelete({
            $or: [{ "incomingShipment.tracking_id": tracking_id }, { "outgoingShipment.tracking_id": tracking_id }],
        });

        if (!logistics) {
            console.warn("Logistics entry not found for tracking_id:", tracking_id);
            return res.status(404).json({ message: "Logistics entry not found" });
        }

        res.status(200).json({ message: "Logistics entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting logistics entry:", error);
        res.status(400).json({ message: "Error deleting logistics entry", error: error.message });
    }
};
