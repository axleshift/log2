import VendorQuotePending from "../models/vendorQuotePending.js";

// Create a new vendor quote
export const createVendorQuote = async (req, res) => {
    try {
        const quote = new VendorQuotePending(req.body);
        await quote.save();
        res.status(201).json(quote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all vendor quotes
export const getAllVendorQuotes = async (req, res) => {
    try {
        const quotes = await VendorQuotePending.find();
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update vendor quote status
export const updateVendorQuoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedQuote = await VendorQuotePending.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
