import RFQ from "../models/RFQ.js";
import Procurement from "../models/procurement.js";
import Vendor from "../models/vendor.js";
import { sendInviteEmail } from "../utils/otpStore.js";

// Create a new RFQ and link it to a procurement
export const createRFQ = async (req, res) => {
    const { procurementId, vendors, deadline } = req.body;

    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const procurement = await Procurement.findById(procurementId);
        if (!procurement) {
            return res.status(404).json({ message: "Procurement not found!" });
        }

        const rfq = new RFQ({
            procurementId,
            requestedBy: req.user.id,
            vendors,
            products: procurement.products,
            deadline,
            status: "Open",
            quotes: [],
        });

        await rfq.save();

        // Send email invites to vendors
        const vendorDetails = await Vendor.find({ _id: { $in: vendors } }).populate("userId", "email");
        const vendorEmails = vendorDetails.map((vendor) => vendor.userId.email);

        await sendInviteEmail(vendorEmails, procurement, rfq);

        return res.status(201).json({ message: "RFQ created and invitations sent!", rfq });
    } catch (error) {
        console.error("Error creating RFQ:", error);
        return res.status(500).json({ message: "Error creating RFQ", error: error.message });
    }
};

// Get all RFQs for the authenticated vendor
export const getVendorRFQs = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        const rfqs = await RFQ.find({ vendors: vendor._id, status: { $ne: "Closed" } })
            .populate("procurementId", "title description procurementDate deliveryDate status")
            .exec();

        return res.status(200).json({ message: "Vendor RFQs fetched successfully!", rfqs });
    } catch (error) {
        console.error("Error fetching vendor RFQs:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Get detailed RFQ by RFQ ID for authenticated vendor
export const getVendorRFQById = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        const rfq = await RFQ.findOne({ _id: req.params.id, vendors: vendor._id }).populate("procurementId", "title description procurementDate deliveryDate status").populate("vendors", "username email").populate("quotes.vendorId", "username email");

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found or not authorized." });
        }

        return res.status(200).json({ message: "RFQ details fetched successfully", rfq });
    } catch (error) {
        console.error("Error fetching RFQ details for vendor:", error);
        return res.status(500).json({ message: "Error fetching RFQ details", error: error.message });
    }
};

// Submit a quote for a given RFQ (authenticated vendor)
export const submitQuote = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const { totalPrice, quantity, leadTime, terms, validUntil } = req.body;
        const rfqId = req.params.id;

        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found." });
        }

        if (!rfq.vendors.includes(vendor._id)) {
            return res.status(403).json({ message: "Vendor not invited to this RFQ." });
        }

        // Check if vendor has already submitted a quote
        const existingQuote = rfq.quotes.find((q) => q.vendorId.toString() === vendor._id.toString());
        if (existingQuote) {
            return res.status(400).json({ message: "Quote already submitted by this vendor." });
        }

        const newQuote = {
            vendorId: vendor._id,
            totalPrice,
            quantity,
            leadTime,
            terms,
            validUntil,
            quoteDate: new Date(),
            status: "Pending",
        };

        rfq.quotes.push(newQuote);
        await rfq.save();

        return res.status(201).json({ message: "Quote submitted successfully.", quote: newQuote });
    } catch (error) {
        console.error("Quote submission error:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Delete an RFQ by ID (authenticated)
export const deleteRFQ = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const { id } = req.params;
        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found" });
        }

        await RFQ.findByIdAndDelete(id);
        return res.status(200).json({ message: "RFQ deleted successfully" });
    } catch (error) {
        console.error("Error deleting RFQ:", error);
        return res.status(500).json({ message: "Server error, could not delete RFQ" });
    }
};

// Close the RFQ (authenticated)
export const closeRFQ = async (req, res) => {
    const { rfqId } = req.body;

    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        rfq.status = "Closed";
        await rfq.save();

        return res.status(200).json({ message: "RFQ closed successfully!", rfq });
    } catch (error) {
        console.error("Error closing RFQ:", error);
        return res.status(500).json({ message: "Error closing RFQ", error: error.message });
    }
};

// Get RFQ details by ID - public access (no auth)
export const getRFQDetails = async (req, res) => {
    try {
        const { rfqId } = req.params;

        const rfq = await RFQ.findById(rfqId).populate("procurementId", "title description procurementDate deliveryDate status").populate("vendors", "username email").populate("quotes.vendorId", "username email");

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found" });
        }

        return res.status(200).json({ message: "RFQ details fetched successfully", rfq });
    } catch (error) {
        console.error("Error fetching RFQ details:", error);
        return res.status(500).json({ message: "Error fetching RFQ details", error: error.message });
    }
};
