import TrackingModel from "../models/trackingModel.js";

export const createTracking = async (req, res) => {
    try {
        const tracking = new TrackingModel(req.body);
        await tracking.save();
        res.status(201).json({ message: "Tracking record created successfully", tracking });
    } catch (error) {
        console.error("Error creating tracking record:", error);
        res.status(400).json({ message: "Error creating tracking record", error: error.message });
    }
};

// Read all tracking records
export const getAllTrackings = async (req, res) => {
    try {
        const trackings = await TrackingModel.find();
        console.log("Retrieved trackings:", trackings);
        res.status(200).json({ message: "Trackings retrieved successfully", trackings });
    } catch (error) {
        console.error("Error retrieving tracking records:", error);
        res.status(500).json({ message: "Error retrieving tracking records", error: error.message });
    }
};

// Read a single tracking record by id
export const getTrackingById = async (req, res) => {
    try {
        const trackingId = req.params.id;
        const tracking = await TrackingModel.findOne({ tracking_id: trackingId });
        if (!tracking) {
            console.log(`Tracking not found for ID: ${trackingId}`);
            return res.status(404).json({ message: "Tracking not found" });
        }
        res.status(200).json({ message: "Tracking retrieved successfully", tracking });
    } catch (error) {
        console.error("Error retrieving tracking record:", error);
        res.status(500).json({ message: "Error retrieving tracking record", error: error.message });
    }
};

// Update a tracking record by id
export const updateTracking = async (req, res) => {
    try {
        const trackingId = req.params.id;
        console.log("Updating tracking record for ID:", trackingId);
        const tracking = await TrackingModel.findOneAndUpdate({ tracking_id: trackingId }, req.body, { new: true });

        if (!tracking) {
            console.log(`Tracking not found for ID: ${trackingId}`);
            return res.status(404).json({ message: "Tracking not found" });
        }

        console.log("Tracking updated successfully:", tracking);
        res.status(200).json({ message: "Tracking updated successfully", tracking });
    } catch (error) {
        console.error("Error updating tracking record:", error);
        res.status(400).json({ message: "Error updating tracking record", error: error.message });
    }
};

// Delete a tracking record by id
export const deleteTracking = async (req, res) => {
    try {
        const trackingId = req.params.id;
        console.log("Request to delete tracking record for ID:", trackingId);

        const tracking = await TrackingModel.findOneAndDelete({ tracking_id: trackingId });

        if (!tracking) {
            console.log(`Tracking not found for ID: ${trackingId}`);
            return res.status(404).json({ message: "Tracking not found" });
        }

        console.log("Tracking deleted successfully:", tracking);
        res.status(200).json({ message: " Record Deleted Successfully ", tracking });
    } catch (error) {
        console.error("Error deleting tracking record:", error);
        res.status(500).json({ message: "Error deleting tracking record", error: error.message });
    }
};
