import Procurement from "../models/procurement.js";
import RFQ from "../models/RFQ.js";

// Create Procurement
export const createProcurement = async (req, res) => {
    try {
        console.log("User ID from request:", req.user?.id);

        const { products, rfqRequired } = req.body;
        const estimatedCost = products?.reduce((total, product) => total + (product.unitPrice || 0) * (product.quantity || 0), 0) || 0;

        console.log("Estimated Cost:", estimatedCost);

        const procurement = new Procurement({
            ...req.body,
            requestedBy: req.user.id,
            estimatedCost,
        });

        await procurement.save();
        console.log("Procurement Created:", procurement._id);

        let rfq = null;
        if (rfqRequired && procurement.status === "Approved") {
            rfq = new RFQ({
                procurementId: procurement._id,
                products,
                invitedVendors: [],
                createdBy: req.user.id,
            });
            await rfq.save();
            procurement.rfqId = rfq._id;
            await procurement.save();
            console.log("RFQ Linked to Procurement:", rfq._id);
        }

        const finalProcurement = await Procurement.findById(procurement._id)
            .populate("requestedBy", "email username role")
            .populate({ path: "rfqId", populate: { path: "createdBy", select: "email username role" } });

        res.status(201).json(finalProcurement);
    } catch (error) {
        console.error("Error creating procurement:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all Procurements
export const getProcurements = async (req, res) => {
    try {
        const query = req.query.rfqRequired ? { rfqRequired: req.query.rfqRequired === "true" } : {};
        const procurements = await Procurement.find(query)
            .populate("requestedBy", "email username role")
            .populate({ path: "rfqId", populate: { path: "createdBy", select: "email username role" } });
        res.status(200).json(procurements);
    } catch (error) {
        console.error("Error fetching procurements:", error);
        res.status(500).json({ message: "Error fetching procurements", error });
    }
};

// Get Procurement by ID
export const getProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findById(req.params.id)
            .populate("requestedBy", "email username role")
            .populate({ path: "rfqId", populate: { path: "createdBy", select: "email username role" } })
            .populate("purchaseOrderId");

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
        const procurement = await Procurement.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate("requestedBy", "email username role")
            .populate({ path: "rfqId", populate: { path: "createdBy", select: "email username role" } });

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

// Approve Procurement
export const approveProcurement = async (req, res) => {
    try {
        const procurement = await Procurement.findById(req.params.procurementId);
        if (!procurement) return res.status(404).json({ message: "Procurement not found" });
        if (procurement.status === "Approved") return res.status(400).json({ message: "Procurement is already approved" });

        procurement.status = "Approved";
        await procurement.save();
        res.status(200).json({ message: "Procurement approved successfully", procurement });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reject Procurement
export const rejectProcurement = async (req, res) => {
    try {
        const procurement = await Procurement.findById(req.params.procurementId);
        if (!procurement) return res.status(404).json({ message: "Procurement not found" });
        if (procurement.status === "Rejected") return res.status(400).json({ message: "Procurement is already rejected" });

        procurement.status = "Rejected";
        await procurement.save();
        res.status(200).json({ message: "Procurement rejected successfully", procurement });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
