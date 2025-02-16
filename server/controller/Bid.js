import Bid from "../models/Bid.js";

// Publish a new bid
export const publishBid = async (req, res) => {
    const { title, description, deadline, evaluationCriteria } = req.body;

    try {
        const newBid = new Bid({ title, description, deadline, evaluationCriteria });
        await newBid.save();
        res.status(201).json({ message: "Bid published successfully!", bid: newBid });
    } catch (error) {
        res.status(500).json({ message: "Error publishing bid", error });
    }
};

// GET BIDS
export const getBids = async (req, res) => {
    try {
        const bids = await Bid.find();
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bids", error });
    }
};

// GET SPECIFIC BID BY ID
export const getBidById = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId);
        if (!bid) return res.status(404).json({ message: "Bid not found" });
        res.status(200).json(bid);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bid", error });
    }
};

// Submit a bid
export const submitBid = async (req, res) => {
    const { bidId, amount } = req.body;
    const vendorId = req.user?.id;

    if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized: Vendor ID missing" });
    }

    try {
        const bid = await Bid.findById(bidId);
        if (!bid || bid.status !== "Open") {
            return res.status(400).json({ message: "Bid is closed or invalid" });
        }

        const newBid = { vendorId, amount };
        bid.bids.push(newBid);
        await bid.save();

        res.status(200).json({ message: "Bid submitted successfully", bid });
    } catch (error) {
        res.status(500).json({ message: "Error submitting bid", error });
    }
};

// Evaluate a bid
export const evaluateBid = async (req, res) => {
    const { bidId, vendorId, evaluationComments, evaluationStatus } = req.body;

    try {
        const bid = await Bid.findById(bidId);
        if (!bid || bid.status === "Closed") {
            return res.status(400).json({ message: "Bid is closed or invalid" });
        }

        const vendorBid = bid.bids.find((b) => b.vendorId.toString() === vendorId);
        if (!vendorBid) {
            return res.status(404).json({ message: "Vendor bid not found" });
        }

        vendorBid.status = evaluationStatus;
        vendorBid.evaluationComments = evaluationComments;

        await bid.save();
        res.status(200).json({ message: "Bid evaluated successfully", bid });
    } catch (error) {
        res.status(500).json({ message: "Error evaluating bid", error });
    }
};

// Award a bid
export const awardBid = async (req, res) => {
    const { bidId, vendorId } = req.body;

    try {
        const bid = await Bid.findById(bidId);
        if (!bid || bid.status !== "Open") {
            return res.status(400).json({ message: "Bid is closed or invalid" });
        }

        bid.status = "Awarded";
        bid.awardedVendor = vendorId;

        await bid.save();
        res.status(200).json({ message: "Bid awarded successfully", bid });
    } catch (error) {
        res.status(500).json({ message: "Error awarding bid", error });
    }
};
