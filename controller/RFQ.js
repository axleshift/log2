import RFQ from "../models/RFQ.js";

// Create a new RFQ
export const createRFQ = async (req, res) => {
    try {
        const { rfqNumber, title, description, items, vendors, budget, deadline, createdBy } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newRFQ = new RFQ({
            rfqNumber,
            title,
            description,
            items,
            vendors,
            budget,
            deadline,
            createdBy: req.user.id,
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
        const rfqs = await RFQ.find().populate("vendors").populate("quotes.vendor").populate("createdBy", "email");

        res.status(200).json(rfqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// INVITE VENDORS
export const inviteToRFQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendors } = req.body;

        console.log("Incoming request to invite vendors to RFQ:", id);
        console.log("Received vendors array:", vendors);

        if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
            return res.status(400).json({ error: "Vendors must be a non-empty array of valid ObjectIds" });
        }

        const updatedRFQ = await RFQ.findByIdAndUpdate(id, { $addToSet: { vendors: { $each: vendors } } }, { new: true });

        if (!updatedRFQ) {
            console.log("RFQ not found for ID:", id);
            return res.status(404).json({ error: "RFQ not found" });
        }

        console.log("Vendors successfully invited:", updatedRFQ);
        res.status(200).json({ message: "Vendors added successfully", rfq: updatedRFQ });
    } catch (error) {
        console.error("Error inviting vendors:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET RFQ BY ID
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
