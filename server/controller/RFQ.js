import RFQ from "../models/RFQ.js";
import Procurement from "../models/procurement.js";
import Vendor from "../models/vendor.js";
import { sendInviteEmail } from "../utils/otpStore.js";

// Create a new RFQ and link it to a procurement

export const createRFQ = async (req, res) => {
    const { procurementId, vendors, deadline } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized! User not logged in." });
        }

        const procurement = await Procurement.findById(procurementId);
        if (!procurement) {
            return res.status(404).json({ message: "Procurement not found!" });
        }

        const requestedById = req.user.id;

        const rfq = new RFQ({
            procurementId: procurement._id,
            requestedBy: requestedById,
            vendors: vendors,
            products: procurement.products,
            deadline: deadline,
        });

        await rfq.save();

        // Fetch vendor emails
        const vendorDetails = await Vendor.find({ _id: { $in: vendors } }).populate("userId");
        const vendorEmails = vendorDetails.map((vendor) => vendor.userId.email);

        // Send email invitations
        await sendInviteEmail(vendorEmails, procurement, rfq);

        return res.status(201).json({ message: "RFQ created successfully, invitations sent!", rfq });
    } catch (error) {
        return res.status(500).json({ message: "Error creating RFQ", error });
    }
};

export const getRFQs = async (req, res) => {
    try {
        const { status, procurementId } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        if (procurementId) {
            filter.procurementId = procurementId;
        }

        const rfqs = await RFQ.find(filter).populate("procurementId").populate("vendors").exec();
        return res.status(200).json({ message: "RFQs fetched successfully!", rfqs });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching RFQs", error });
    }
};

export const deleteRFQ = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the RFQ by ID
        const rfq = await RFQ.findById(id);

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found" });
        }

        // Delete the RFQ
        await RFQ.findByIdAndDelete(id);

        res.status(200).json({ message: "RFQ deleted successfully" });
    } catch (error) {
        console.error("Error deleting RFQ:", error);
        res.status(500).json({ message: "Server error, could not delete RFQ" });
    }
};

// Close the RFQ (after vendor selection)
export const closeRFQ = async (req, res) => {
    const { rfqId } = req.body;

    try {
        // Fetch the RFQ
        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        // Close the RFQ
        rfq.status = "Closed";
        await rfq.save();
        return res.status(200).json({ message: "RFQ closed successfully!", rfq });
    } catch (error) {
        return res.status(500).json({ message: "Error closing RFQ", error });
    }
};

export const getRFQDetails = async (req, res) => {
    const { rfqId } = req.params;

    try {
        const rfq = await RFQ.findById(rfqId)
            .populate({
                path: "procurementId",
                populate: {
                    path: "requestedBy",
                    select: "email username",
                },
            })
            .populate({
                path: "vendors", // invited
                populate: {
                    path: "userId",
                    select: "email ",
                },
                select: "businessName fullName contactNumber userId",
            })
            .exec();

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        return res.status(200).json({ message: "RFQ details fetched successfully!", rfq });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching RFQ details", error });
    }
};

// GET VENDOR RFQ
export const getVendorRFQs = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.id });

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        // Fetch RFQs where the vendor is invited and populate procurement details
        const rfqs = await RFQ.find({ vendors: vendor._id })
            .populate({
                path: "procurementId",
                select: "title description requestedBy procurementDate deliveryDate status",
            })
            .populate({
                path: "vendors",
                select: "username email",
            });

        res.json(rfqs);
    } catch (error) {
        console.error("Error fetching vendor RFQs:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// GET VENDOR RFQ DETAILS BY ID
export const getVendorRFQsByID = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.id });

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        // Find the RFQ that matches the requested ID and check if the vendor is invited
        const rfq = await RFQ.findOne({ _id: req.params.id, vendors: vendor._id })
            .populate({
                path: "procurementId",
                populate: {
                    path: "requestedBy",
                    select: "username email",
                },
                select: "title description requestedBy procurementDate deliveryDate status",
            })
            .populate({
                path: "vendors",
                select: "username email",
            });

        if (!rfq) {
            return res.status(404).json({ error: "RFQ not found or you are not authorized to view it." });
        }

        res.json(rfq);
    } catch (error) {
        console.error("Error fetching RFQ details for vendor:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const submitQuote = async (req, res) => {
    try {
        const { totalPrice, quantity, leadTime, terms, validUntil } = req.body;
        const rfqId = req.params.id;

        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ error: "RFQ not found." });
        }

        if (!rfq.vendors.includes(vendor._id)) {
            return res.status(403).json({ error: "Vendor not invited to this RFQ." });
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

        // Push quote to RFQ
        rfq.quotes.push(newQuote);
        await rfq.save();

        res.status(201).json({ message: "Quote submitted successfully.", quote: newQuote });
    } catch (error) {
        console.error("Quote submission error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};
