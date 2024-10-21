import InventoryRecord from "../models/inventoryModel.js";
import logger from "../utils/logger.js";

// Utility function for consistent responses
const handleResponse = (res, status, message, data = null) => {
    return res.status(status).json({ status: status === 200 || status === 201 ? "success" : "error", message, data });
};

// Get all shipment records
export const getAllShipments = async (req, res, next) => {
    try {
        const shipments = await InventoryRecord.find();
        logger.info("Fetched all shipments");
        return handleResponse(res, 200, "Shipments retrieved successfully", shipments);
    } catch (error) {
        logger.error("Error fetching shipments:", { message: error.message, stack: error.stack });
        return handleResponse(res, 500, "Internal Server Error");
    }
};

// Get a shipment record by ID
export const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await InventoryRecord.findById(req.params.id);
        if (!shipment) {
            logger.warn(`Shipment not found: ${req.params.id}`);
            return handleResponse(res, 404, "Shipment not found");
        }
        logger.info(`Fetched shipment: ${req.params.id}`);
        return handleResponse(res, 200, "Shipment retrieved successfully", shipment);
    } catch (error) {
        logger.error(`Error fetching shipment ${req.params.id}:`, { message: error.message, stack: error.stack });
        return handleResponse(res, 500, "Internal Server Error");
    }
};

// Create a shipment
export const createShipment = async (req, res, next) => {
    try {
        const newShipment = new InventoryRecord(req.body);
        const savedShipment = await newShipment.save();
        logger.info("Shipment created successfully", { id: savedShipment._id });
        return handleResponse(res, 201, "Shipment created successfully", savedShipment);
    } catch (error) {
        logger.error("Error creating shipment:", { message: error.message, stack: error.stack });
        return handleResponse(res, 400, "Failed to create shipment", error.message);
    }
};

// Update a shipment record by ID
export const updateShipment = async (req, res, next) => {
    try {
        const { status, ...updateData } = req.body;
        const shipment = await InventoryRecord.findByIdAndUpdate(req.params.id, { ...updateData, ...(status && { status }) }, { new: true, runValidators: true });

        if (!shipment) {
            logger.warn(`Shipment not found for update: ${req.params.id}`);
            return handleResponse(res, 404, "Shipment not found");
        }
        logger.info(`Updated shipment: ${req.params.id}`, { shipment });
        return handleResponse(res, 200, "Shipment updated successfully", shipment);
    } catch (error) {
        logger.error(`Error updating shipment ${req.params.id}:`, { message: error.message, stack: error.stack });
        return handleResponse(res, 500, "Internal Server Error");
    }
};

// Delete a shipment record by ID
export const deleteShipment = async (req, res, next) => {
    try {
        const shipment = await InventoryRecord.findByIdAndDelete(req.params.id);
        if (!shipment) {
            logger.warn(`Shipment not found for deletion: ${req.params.id}`);
            return handleResponse(res, 404, "Shipment not found");
        }
        logger.info(`Deleted shipment: ${req.params.id}`);
        return res.sendStatus(204); // No content response for successful deletion
    } catch (error) {
        logger.error(`Error deleting shipment ${req.params.id}:`, { message: error.message, stack: error.stack });
        return handleResponse(res, 500, "Internal Server Error");
    }
};

// Export controller
export default {
    getAllShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment,
};
