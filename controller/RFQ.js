import RFQ from "../models/RFQ.js";
import Procurement from "../models/procurement.js";
import Vendor from "../models/vendor.js";

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

        // Save the RFQ
        await rfq.save();
        return res.status(201).json({ message: "RFQ created successfully!", rfq });
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

/*export const getRFQById = async (req, res) => {
    const { id } = req.params;

    try {
        const rfq = await RFQ.findById(id)
            .populate({
                path: "procurementId",
                select: "title description products",
            })
            .populate({
                path: "vendors",
                select: "businessName fullName contactNumber userId",
                populate: { path: "userId", select: "email" },
            })
            .populate({
                path: "quotes.vendorId",
                select: "businessName",
            })
            .populate({
                path: "selectedVendorId",
                select: "businessName",
            })
            .exec();

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        return res.status(200).json({
            message: "RFQ fetched successfully!",
            rfq: {
                _id: rfq._id,
                procurementId: rfq.procurementId,
                products: rfq.procurementId?.products || [], // Ensure products exist
                invitedVendors: rfq.vendors.map((vendor) => ({
                    _id: vendor._id,
                    businessName: vendor.businessName,
                    fullName: vendor.fullName,
                    contactNumber: vendor.contactNumber,
                    email: vendor.userId?.email || "No Email",
                })),
                quotes: rfq.quotes.map((quote) => ({
                    vendorId: quote.vendorId?._id || null,
                    vendorName: quote.vendorId?.businessName || "Unknown Vendor",
                    quoteDetails: quote.quoteDetails || [],
                    status: quote.status,
                })),
                selectedVendor: rfq.selectedVendorId || null,
                status: rfq.status,
                createdBy: rfq.createdBy || null,
                createdAt: rfq.createdAt,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching RFQ", error });
    }
};
*/

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

export const getRFQById = async (req, res) => {
    try {
        const { id } = req.params;

        const rfq = await RFQ.findById(id)
            .populate("requestedBy", "email username role")
            .populate({
                path: "procurementId",
                populate: { path: "requestedBy", select: "email username role" },
            });

        if (!rfq) {
            return res.status(404).json({ error: "RFQ not found" });
        }

        res.status(200).json(rfq);
    } catch (error) {
        console.error("Error fetching RFQ:", error);
        res.status(500).json({ error: error.message });
    }
};

// Submit a quote from a vendor
export const submitQuote = async (req, res) => {
    const { rfqId, vendorId, totalPrice, terms } = req.body;

    try {
        // Fetch the RFQ
        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        // Check if the vendor is invited to submit a quote
        if (!rfq.vendors.includes(vendorId)) {
            return res.status(400).json({ message: "Vendor not invited to submit quote!" });
        }

        // Add the vendor's quote
        rfq.quotes.push({
            vendorId,
            totalPrice,
            terms,
            status: "Pending",
        });

        // Save the RFQ with the new quote
        await rfq.save();
        return res.status(201).json({ message: "Quote submitted successfully!", rfq });
    } catch (error) {
        return res.status(500).json({ message: "Error submitting quote", error });
    }
};

// Select a vendor for the RFQ
export const selectVendor = async (req, res) => {
    const { rfqId, selectedVendorId } = req.body;

    try {
        // Fetch the RFQ
        const rfq = await RFQ.findById(rfqId);
        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        // Set the selected vendor
        rfq.selectedVendorId = selectedVendorId;
        rfq.status = "Awarded";

        // Save the RFQ with the selected vendor
        await rfq.save();
        return res.status(200).json({ message: "Vendor selected successfully!", rfq });
    } catch (error) {
        return res.status(500).json({ message: "Error selecting vendor", error });
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
        const rfq = await RFQ.findById(rfqId).populate("procurementId").populate("vendors").exec();

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found!" });
        }

        return res.status(200).json({ message: "RFQ details fetched successfully!", rfq });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching RFQ details", error });
    }
};
