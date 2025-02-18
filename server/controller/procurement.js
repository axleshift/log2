import Procurement from "../models/procurement.js";

// Create Procurement
export const createProcurement = async (req, res) => {
    try {
        const { title, description, products, procurementDate, deliveryDate } = req.body;

        const newProcurement = new Procurement({
            title,
            description,
            createdBy: req.user._id,
            products,
            procurementDate,
            deliveryDate,
        });

        const savedProcurement = await newProcurement.save();
        res.status(201).json(savedProcurement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get all procurements
export const getAllProcurements = async (req, res) => {
    try {
        const procurements = await Procurement.find().populate("createdBy", "email").populate("products", "itemName").populate("invitedVendors", "fullName").populate("purchaseOrders", "orderNumber status totalAmount");

        res.status(200).json(procurements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get procurement by ID
export const getProcurementById = async (req, res) => {
    try {
        const procurement = await Procurement.findById(req.params.id)
            .populate("createdBy", "email")
            .populate("products", "itemName")
            .populate("invitedVendors", "fullName")
            .populate("purchaseOrders", "orderNumber status totalAmount")
            .populate("quotes.vendor", "fullName")
            .populate("negotiations.vendor", "fullName");

        if (!procurement) {
            return res.status(404).json({ msg: "Procurement not found" });
        }

        res.status(200).json(procurement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Update procurement status
export const updateProcurementStatus = async (req, res) => {
    try {
        const procurement = await Procurement.findByIdAndUpdate(req.params.id, { status: req.body.status, updatedAt: Date.now() }, { new: true });

        if (!procurement) {
            return res.status(404).json({ msg: "Procurement not found" });
        }

        res.status(200).json(procurement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Add a quote to a procurement
export const addQuoteToProcurement = async (req, res) => {
    try {
        const { vendor, price, terms, deliveryTime } = req.body;
        const procurement = await Procurement.findById(req.params.id);

        if (!procurement) {
            return res.status(404).json({ msg: "Procurement not found" });
        }

        procurement.quotes.push({
            vendor,
            price,
            terms,
            deliveryTime,
            status: "Pending",
        });

        procurement.updatedAt = Date.now();
        await procurement.save();
        res.status(200).json(procurement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Add negotiation to a procurement
export const addNegotiationToProcurement = async (req, res) => {
    try {
        const { vendor, proposedTerms, finalTerms, status } = req.body;
        const procurement = await Procurement.findById(req.params.id);

        if (!procurement) {
            return res.status(404).json({ msg: "Procurement not found" });
        }

        procurement.negotiations.push({
            vendor,
            proposedTerms,
            finalTerms,
            status: status || "Ongoing",
        });

        procurement.updatedAt = Date.now();
        await procurement.save();
        res.status(200).json(procurement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Add a purchase order to a procurement
export const addPurchaseOrderToProcurement = async (req, res) => {
    try {
        const { purchaseOrderId } = req.body;
        const procurement = await Procurement.findById(req.params.id);

        if (!procurement) {
            return res.status(404).json({ msg: "Procurement not found" });
        }

        procurement.purchaseOrders.push(purchaseOrderId);
        procurement.updatedAt = Date.now();
        await procurement.save();
        res.status(200).json(procurement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Delete procurement
export const deleteProcurement = async (req, res) => {
    try {
        const procurement = await Procurement.findByIdAndDelete(req.params.id);

        if (!procurement) {
            return res.status(404).json({ msg: "Procurement not found" });
        }

        res.status(200).json({ msg: "Procurement deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
