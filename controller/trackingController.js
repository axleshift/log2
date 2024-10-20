import TrackingItem from "../models/trackingModel.js";
import { validationResult } from "express-validator";
import logger from "../utils/logger.js";

// Utility function for validation errors
const handleValidationErrors = (res, errors) => {
    return res.status(400).json({ status: "error", errors: errors.array() });
};

// Create a tracking item
export const createTrackingItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleValidationErrors(res, errors);
    }

    try {
        const newItem = new TrackingItem(req.body);
        const savedItem = await newItem.save();
        logger.info("Created tracking item:", { id: savedItem._id, data: savedItem });
        return res.status(201).json({ status: "success", item: savedItem });
    } catch (error) {
        logger.error("Failed to create tracking item:", { message: error.message, stack: error.stack });
        next(error); // Pass the error to the error handler middleware
    }
};

// Get all tracking items
export const getTrackingItems = async (req, res, next) => {
    try {
        const items = await TrackingItem.find();
        logger.info("Fetched tracking items:", { count: items.length });
        return res.json({ status: "success", items });
    } catch (error) {
        logger.error("Failed to fetch tracking items:", { message: error.message, stack: error.stack });
        next(error);
    }
};

// Update a tracking item
export const updateTrackingItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleValidationErrors(res, errors);
    }

    const { id } = req.params;
    try {
        const updatedItem = await TrackingItem.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ status: "error", message: "Tracking item not found" });
        }
        logger.info("Updated tracking item:", { id, data: updatedItem });
        return res.json({ status: "success", item: updatedItem });
    } catch (error) {
        logger.error("Failed to update tracking item:", { message: error.message, stack: error.stack });
        next(error);
    }
};

// Delete a tracking item
export const deleteTrackingItem = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedItem = await TrackingItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ status: "error", message: "Tracking item not found" });
        }
        logger.info("Deleted tracking item:", { id: deletedItem._id });
        return res.sendStatus(204);
    } catch (error) {
        logger.error("Failed to delete tracking item:", { message: error.message, stack: error.stack });
        next(error);
    }
};
