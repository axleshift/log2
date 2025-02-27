import Procurement from "../models/procurement.js";

// Create Procurement
export const createProcurement = async (req, res) => {
    try {
        console.log("User ID from request:", req.user?.id);

        const { products } = req.body;
        const estimatedCost = products?.reduce((total, product) => total + (product.unitPrice || 0) * (product.quantity || 0), 0) || 0;

        console.log("Estimated Cost:", estimatedCost);

        const procurement = new Procurement({
            ...req.body,
            requestedBy: req.user.id,
            estimatedCost,
        });

        await procurement.save();
        console.log("Procurement Created:", procurement._id);

        const finalProcurement = await Procurement.findById(procurement._id).populate("requestedBy", "email username role");

        res.status(201).json(finalProcurement);
    } catch (error) {
        console.error("Error creating procurement:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all Procurements
export const getProcurements = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const query = req.user.role === "super admin" ? {} : { requestedBy: req.user.id };

        if (req.query.status) {
            query.status = req.query.status;
        }

        console.log("Fetching procurements for user:", req.user.id, "Query:", query);

        const procurements = await Procurement.find(query).populate("requestedBy", "email username role");

        res.status(200).json(procurements);
    } catch (error) {
        console.error("Error fetching procurements:", error);
        res.status(500).json({ message: "Error fetching procurements", error });
    }
};

// Get Procurement by ID
export const getProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findById(req.params.id).populate("requestedBy", "email username role");

        if (!procurement) return res.status(404).json({ error: "Procurement not found" });
        res.status(200).json(procurement);
    } catch (error) {
        console.error("Error fetching procurement:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Procurement
export const updateProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("requestedBy", "email username role");

        if (!procurement) return res.status(404).json({ error: "Procurement not found" });
        res.status(200).json(procurement);
    } catch (error) {
        console.error("Error updating procurement:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Procurement
export const deleteProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findByIdAndDelete(req.params.id);
        if (!procurement) return res.status(404).json({ error: "Procurement not found" });
        res.status(200).json({ message: "Procurement deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve Procurement Request
export const approveProcurement = async (req, res) => {
    try {
        const { id } = req.params;

        const procurement = await Procurement.findByIdAndUpdate(id, { status: "Approved", rejectionReason: null }, { new: true });

        if (!procurement) return res.status(404).json({ message: "Procurement request not found" });

        res.status(200).json({ message: "Procurement Approved", data: procurement });
    } catch (error) {
        res.status(500).json({ message: "Error approving procurement", error });
    }
};

// Reject Procurement Request
export const rejectProcurement = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        if (!rejectionReason || rejectionReason.trim() === "") {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        const procurement = await Procurement.findByIdAndUpdate(id, { status: "Rejected", rejectionReason }, { new: true });

        if (!procurement) {
            return res.status(404).json({ message: "Procurement request not found" });
        }

        res.status(200).json({ message: "Procurement Rejected", data: procurement });
    } catch (error) {
        console.error("Error rejecting procurement:", error);
        res.status(500).json({ message: "Error rejecting procurement", error });
    }
};
