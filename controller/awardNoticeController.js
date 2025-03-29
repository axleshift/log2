import AwardNotice from "../models/awardModel.js";
import Vendor from "../models/vendor.js";

export const createAwardNotice = async (req, res) => {
    try {
        const { title, amount, date, details, vendorId, poId } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const award = new AwardNotice({
            title,
            amount,
            date,
            details,
            vendorId,
            poId,
        });

        await award.save();
        res.status(201).json({ message: "Award notice created", award });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getRecentAwardNotices = async (req, res) => {
    try {
        const recent = await AwardNotice.find().sort({ date: -1 }).limit(10).populate("vendorId", "businessName fullName");

        res.status(200).json(recent);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch award notices", error });
    }
};

export const getAwardNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const award = await AwardNotice.findById(id).populate("vendorId", "businessName fullName");
        if (!award) {
            return res.status(404).json({ message: "Award notice not found" });
        }

        res.status(200).json(award);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notice", error });
    }
};
