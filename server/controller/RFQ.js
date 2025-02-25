import Procurement from "../models/procurement.js";
import RFQ from "../models/RFQ.js";
import Vendor from "../models/vendor.js";
import { sendEmail } from "../utils/otpStore.js";

// Create RFQ
export const createRFQ = async (req, res) => {
    try {
        console.log("📥 Received RFQ creation request:", req.body);

        const { procurementId } = req.body;

        // Check if Procurement exists and is Approved
        if (procurementId) {
            const procurement = await Procurement.findById(procurementId);

            if (!procurement) {
                return res.status(400).json({ error: "Procurement not found" });
            }

            if (procurement.status !== "Approved") {
                return res.status(400).json({ error: "Procurement must be approved to create an RFQ" });
            }

            // If RFQ already exists for this procurement, return an error
            if (procurement.rfqId) {
                return res.status(400).json({ error: "Procurement already has an RFQ assigned" });
            }
        }

        // Create the RFQ
        const rfq = new RFQ({ ...req.body });
        await rfq.save();

        // If linked to a Procurement, update it
        if (procurementId) {
            const procurement = await Procurement.findById(procurementId);
            procurement.rfqId = rfq._id;
            await procurement.save();
            console.log("Procurement updated with RFQ ID:", procurement.rfqId);
        }

        res.status(201).json(rfq);
    } catch (error) {
        console.error("❌ Error in createRFQ:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all RFQs
export const getAllRFQs = async (req, res) => {
    try {
        const rfqs = await RFQ.find()
            .populate("procurementId")
            .populate("products")
            .populate("createdBy", "email username role")
            .populate("invitedVendors", "businessName fullName contactNumber userId")
            .populate({
                path: "invitedVendors",
                populate: {
                    path: "userId",
                    select: "email",
                },
            })
            .populate("quotes.vendorId", "businessName email");

        res.status(200).json(rfqs);
    } catch (error) {
        console.error("Error in getAllRFQs:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get RFQ by ID
export const getRFQById = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id)
            .populate("procurementId")
            .populate("createdBy", "email username role")
            .populate({
                path: "invitedVendors",
                populate: {
                    path: "userId",
                    select: "email",
                },
            })
            .populate({
                path: "quotes.vendorId",
                select: "businessName email",
            });

        if (!rfq) return res.status(404).json({ error: "RFQ not found" });

        res.status(200).json(rfq);
    } catch (error) {
        console.error("Error in getRFQById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update RFQ
export const updateRFQ = async (req, res) => {
    try {
        const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("procurementId invitedVendors selectedVendor");
        if (!rfq) return res.status(404).json({ error: "RFQ not found" });
        res.status(200).json(rfq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete RFQ
export const deleteRFQ = async (req, res) => {
    try {
        const rfq = await RFQ.findByIdAndDelete(req.params.id);
        if (!rfq) return res.status(404).json({ error: "RFQ not found" });
        res.status(200).json({ message: "RFQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const closeRFQ = async (req, res) => {
    try {
        const { id } = req.params;
        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found" });
        }

        if (rfq.status === "Closed") {
            return res.status(400).json({ message: "RFQ is already closed" });
        }

        rfq.status = "Closed";
        await rfq.save();

        res.status(200).json({ message: "RFQ closed successfully", rfq });
    } catch (error) {
        res.status(500).json({ message: "Error closing RFQ", error: error.message });
    }
};

// Invite vendors to an RFQ
export const inviteToRFQ = async (req, res) => {
    try {
        const { id: rfqId } = req.params;
        const { vendorIds } = req.body;

        if (!vendorIds || !Array.isArray(vendorIds)) {
            return res.status(400).json({ message: "Invalid vendors list" });
        }

        const rfq = await RFQ.findById(rfqId).select("invitedVendors");
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found" });
        }
        const existingVendorIds = new Set(rfq.invitedVendors.map((id) => id.toString()));
        const newVendorIds = vendorIds.filter((id) => !existingVendorIds.has(id));

        if (newVendorIds.length === 0) {
            return res.status(200).json({ message: "No new vendors to invite", rfq });
        }

        const vendors = await Vendor.find({ _id: { $in: newVendorIds } }).populate("userId", "email");
        if (!vendors.length) {
            return res.status(400).json({ message: "No valid vendors found for invitation" });
        }
        // Update RFQ only if new vendors exist
        const updatedRFQ = await RFQ.findByIdAndUpdate(rfqId, { $addToSet: { invitedVendors: { $each: newVendorIds } } }, { new: true }).populate("invitedVendors");
        await Promise.all(vendors.filter((vendor) => vendor.userId?.email).map((vendor) => sendEmail(vendor.userId.email, rfqId)));

        res.status(200).json({
            message: "Vendors invited successfully, emails sent",
            rfq: updatedRFQ,
        });
    } catch (error) {
        console.error("Error in inviteToRFQ:", error);
        res.status(500).json({ message: "Error inviting vendors", error: error.message });
    }
};

// Submit a quote
export const submitQuote = async (req, res) => {
    try {
        const { rfqId, vendorId, quoteAmount, items } = req.body;
        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found." });
        }
        if (!rfq.invitedVendors.includes(vendorId)) {
            return res.status(403).json({ message: "Vendor not invited to this RFQ." });
        }
        const existingQuote = rfq.quotes.find((quote) => quote.vendorId.toString() === vendorId);
        if (existingQuote) {
            return res.status(400).json({ message: "Vendor has already submitted a quote." });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid items in quote." });
        }

        // Add the quote to the RFQ
        const newQuote = {
            vendorId,
            quoteAmount,
            items,
            submittedAt: new Date(),
        };
        rfq.quotes.push(newQuote);
        await rfq.save();

        res.status(200).json({ message: "Quote submitted successfully", rfq });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Award vendor and create a PO
export const awardVendor = async (req, res) => {
    try {
        const { rfqId, vendorId } = req.body;

        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found." });
        }
        rfq.awardedVendor = vendorId;
        rfq.status = "Awarded";
        await rfq.save();

        const procurement = await Procurement.findById(rfq.procurementId);
        if (!procurement) {
            return res.status(404).json({ message: "Procurement not found." });
        }

        const purchaseOrder = new PurchaseOrder({
            procurementId: procurement._id,
            vendorId: rfq.awardedVendor,
            items: procurement.items,
            paymentTerms: rfq.paymentTerms,
        });

        await purchaseOrder.save();
        procurement.purchaseOrders.push(purchaseOrder._id);
        await procurement.save();

        res.status(200).json({ message: "Vendor awarded and PO created successfully", rfq });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update payment terms for an RFQ
export const updatePaymentTerms = async (req, res) => {
    try {
        const { rfqId, paymentTerms } = req.body;

        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found." });
        }

        rfq.paymentTerms = paymentTerms;
        await rfq.save();

        res.status(200).json(rfq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
