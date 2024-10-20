import InventoryRecord from "../models/inventoryModel.js";
import logger from "../utils/logger.js";

// Utility function for consistent responses
const handleResponse = (res, status, message, data = null) => {
    return res.status(status).json({ status: status === 200 ? "success" : "error", message, data });
};

// Get all shipment records
export const getAllShipments = async (req, res, next) => {
    try {
        const shipments = await InventoryRecord.find();
        logger.info("Fetched all shipments");
        return handleResponse(res, 200, "Shipments retrieved successfully", shipments);
    } catch (error) {
        logger.error("Error fetching shipments:", { message: error.message, stack: error.stack });
        next(error);
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
        next(error);
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
        logger.info(`Updated shipment: ${req.params.id}`);
        return handleResponse(res, 200, "Shipment updated successfully", shipment);
    } catch (error) {
        logger.error(`Error updating shipment ${req.params.id}:`, { message: error.message, stack: error.stack });
        next(error);
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
        return res.sendStatus(204);
    } catch (error) {
        logger.error(`Error deleting shipment ${req.params.id}:`, { message: error.message, stack: error.stack });
        next(error);
    }
};

// Export controller
export default {
    getAllShipments,
    getShipmentById,
    updateShipment,
    deleteShipment,
};
