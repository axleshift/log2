import VendorQuotePending from "../models/vendorQuotePending.js";
import Vendor from "../models/vendor.js";

// Create a new vendor quote
export const createVendorQuote = async (req, res) => {
    try {
        const { rfqId, price, details } = req.body;

        if (!rfqId || !price) {
            return res.status(400).json({ message: "RFQ ID and price are required." });
        }

        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const existingQuote = await VendorQuotePending.findOne({
            vendorId: vendor._id,
            rfqId,
        });
        if (existingQuote) {
            return res.status(400).json({ message: "Quote already submitted for this RFQ." });
        }

        const quote = new VendorQuotePending({
            vendorId: vendor._id,
            rfqId,
            price,
            details: details || "",
        });

        await quote.save();

        const populatedQuote = await quote.populate({
            path: "vendorId",
            select: "businessName fullName",
        });
        res.status(201).json(populatedQuote);
    } catch (error) {
        console.error("Error creating quote:", error);
        res.status(400).json({ error: error.message });
    }
};

// Get all vendor quotes with vendor info populated
export const getAllVendorQuotes = async (req, res) => {
    try {
        const quotes = await VendorQuotePending.find().populate({
            path: "vendorId",
            select: "businessName fullName",
        });

        res.status(200).json(quotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update vendor quote status
export const updateVendorQuoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedQuote = await VendorQuotePending.findByIdAndUpdate(id, { status }, { new: true }).populate({
            path: "vendorId",
            select: "businessName fullName",
        });

        if (!updatedQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        res.status(200).json(updatedQuote);
    } catch (error) {
        console.error("Error updating quote status:", error);
        res.status(400).json({ error: error.message });
    }
};

// DELETE
export const deleteVendorQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuote = await VendorQuotePending.findByIdAndDelete(id);
        if (!deletedQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }
        res.status(200).json({ message: "Quote deleted successfully" });
    } catch (error) {
        console.error("Error deleting quote:", error);
        res.status(500).json({ error: error.message });
    }
};
