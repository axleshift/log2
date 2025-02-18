import Vendor from "../models/vendor.js";
import User from "../models/UserModel.js";

// Create Vendor
export const createVendor = async (req, res) => {
    try {
        const { user, businessName, fullName, email, contactNumber, businessAddress, taxId, certifications } = req.body;

        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingVendor = await Vendor.findOne({ $or: [{ email }, { taxId }] });
        if (existingVendor) {
            return res.status(400).json({ message: "Vendor already exists" });
        }

        const vendor = new Vendor({
            userId: user,
            businessName,
            fullName,
            email,
            contactNumber,
            businessAddress,
            taxId,
            certifications,
        });

        await vendor.save();
        res.status(201).json({ message: "Vendor created successfully", vendor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("userId", "username email role status");
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Vendor by ID with User Details
export const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate("userId", "username email role status");
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Vendor with User Details
export const updateVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        Object.assign(vendor, req.body);
        vendor.updatedAt = Date.now();

        await vendor.save();
        await vendor.populate("userId", "username email role status");

        res.status(200).json({ message: "Vendor updated successfully", vendor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Vendor
export const deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "Approved";
        vendor.updatedAt = Date.now();
        await vendor.save();
        await vendor.populate("userId", "username email role status");

        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Approve Vendor with User Details
export const approveVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ vendorId: req.params.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "Approved";
        vendor.updatedAt = Date.now();
        await vendor.save();
        await vendor.populate("userId", "username email role status");

        res.status(200).json({ message: "Vendor approved successfully", vendor });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Reject Vendor with User Details
export const rejectVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ vendorId: req.params.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "Rejected";
        vendor.updatedAt = Date.now();
        await vendor.save();
        await vendor.populate("userId", "username email role status");

        res.status(200).json({ message: "Vendor rejected successfully", vendor });
    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Unapprove Vendor with User Details
export const unapproveVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ vendorId: req.params.id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "Pending";
        vendor.updatedAt = Date.now();
        await vendor.save();
        await vendor.populate("userId", "username email role status");

        res.status(200).json({ message: "Vendor approval canceled", vendor });
    } catch (error) {
        console.error("Error canceling vendor approval:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
