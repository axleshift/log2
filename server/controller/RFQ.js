import RFQ from "../models/RFQ.js";

// Create a new RFQ
export const createRFQ = async (req, res) => {
    try {
        const { rfqNumber, title, description, items, vendors, createdBy } = req.body;

        const newRFQ = new RFQ({
            rfqNumber,
            title,
            description,
            items,
            vendors,
            createdBy,
        });

        const savedRFQ = await newRFQ.save();
        res.status(201).json(savedRFQ);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all RFQs
export const getAllRFQs = async (req, res) => {
    try {
        const rfqs = await RFQ.find().populate("vendors").populate("quotes.vendor");

        res.status(200).json(rfqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addVendorsToRFQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendors } = req.body;
        if (!vendors || !Array.isArray(vendors)) {
            return res.status(400).json({ error: "Vendors must be an array of valid ObjectIds" });
        }

        const updatedRFQ = await RFQ.findByIdAndUpdate(id, { $addToSet: { vendors: { $each: vendors } } }, { new: true });

        if (!updatedRFQ) {
            return res.status(404).json({ error: "RFQ not found" });
        }

        res.status(200).json({ message: "Vendors added successfully", rfq: updatedRFQ });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRFQById = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id).populate("vendors").populate("quotes.vendor").populate("awardedVendor").populate("createdBy");

        if (!rfq) {
            return res.status(404).json({ message: "RFQ not found" });
        }

        res.status(200).json(rfq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Vendors submit a quote (bid)
export const submitQuote = async (req, res) => {
    try {
        const { vendor, price, deliveryTime, additionalNotes } = req.body;
        const rfq = await RFQ.findById(req.params.id);

        if (!rfq) {
            return res.status(404).json({ error: "RFQ not found" });
        }

        rfq.quotes.push({ vendor, price, deliveryTime, additionalNotes });
        await rfq.save();

        res.status(200).json({ message: "Quote submitted successfully", rfq });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Award RFQ to a vendor
export const awardRFQ = async (req, res) => {
    try {
        const { awardedVendor } = req.body;
        const rfq = await RFQ.findById(req.params.id);

        if (!rfq) {
            return res.status(404).json({ error: "RFQ not found" });
        }

        rfq.awardedVendor = awardedVendor;
        rfq.status = "Awarded";
        await rfq.save();

        res.status(200).json({ message: "RFQ awarded successfully", rfq });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
