import Procurement from "../models/procurement.js";
import RFQ from "../models/RFQ.js";

// Create Procurement
export const createProcurement = async (req, res) => {
    try {
        console.log("User ID from request:", req.user?.id);

        // Create the Procurement object
        const procurement = new Procurement({
            ...req.body,
            createdBy: req.user.id,
        });

        console.log("Creating Procurement:", procurement);
        await procurement.save();
        console.log("Procurement saved successfully:", procurement._id);

        // If RFQ is required, create the RFQ
        let rfq = null;
        if (req.body.rfqRequired) {
            rfq = new RFQ({
                procurementId: procurement._id,
                products: req.body.products || [], // Expecting an array of product objects
                invitedVendors: [], // Vendors will be invited later
                createdBy: req.user.id,
            });

            console.log("Creating RFQ:", rfq);
            await rfq.save();
            console.log("RFQ saved successfully:", rfq._id);

            // Link RFQ to Procurement
            procurement.rfqId = rfq._id;
            await procurement.save();
            console.log("Procurement updated with RFQ ID:", procurement.rfqId);
        }

        // Return the final procurement object, populated with related data
        const finalProcurement = await Procurement.findById(procurement._id)
            .populate("createdBy", "email username role")
            .populate("rfqId") // Populate RFQ
            .then((p) => p.populate("rfqId.createdBy", "email username role"));

        console.log("Final Procurement Output:", JSON.stringify(finalProcurement, null, 2));
        res.status(201).json(finalProcurement);
    } catch (error) {
        console.error("Error in createProcurement:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET PROCUREMENT RELATED ONLY WITHOUT RFQ
export const getProcurements = async (req, res) => {
    try {
        const procurements = await Procurement.find({ rfqRequired: false }).select("-rfqId").populate("createdBy", "email username role");
        res.status(200).json(procurements);
    } catch (error) {
        res.status(500).json({ message: "Error fetching procurements", error });
    }
};

// Get all Procurements
export const getAllProcurement = async (req, res) => {
    try {
        const procurements = await Procurement.find().populate("createdBy rfqId");
        res.status(200).json(procurements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Procurement by ID
export const getProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findById(req.params.id).populate("createdBy rfqId");
        if (!procurement) return res.status(404).json({ error: "Procurement not found" });
        res.status(200).json(procurement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Procurement
export const updateProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("createdBy rfqId");
        if (!procurement) return res.status(404).json({ error: "Procurement not found" });
        res.status(200).json(procurement);
    } catch (error) {
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

export const approveProcurement = async (req, res) => {
    try {
        const { procurementId } = req.params;
        const procurement = await Procurement.findById(procurementId);

        if (!procurement) {
            return res.status(404).json({ message: "Procurement not found" });
        }

        if (procurement.status === "Approved") {
            return res.status(400).json({ message: "Procurement is already approved" });
        }

        procurement.status = "Approved";
        await procurement.save();

        res.status(200).json({ message: "Procurement approved successfully", procurement });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const rejectProcurement = async (req, res) => {
    try {
        const { procurementId } = req.params;
        const procurement = await Procurement.findById(procurementId);

        if (!procurement) {
            return res.status(404).json({ message: "Procurement not found" });
        }

        if (procurement.status === "Rejected") {
            return res.status(400).json({ message: "Procurement is already rejected" });
        }

        procurement.status = "Rejected";
        await procurement.save();

        res.status(200).json({ message: "Procurement rejected successfully", procurement });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
