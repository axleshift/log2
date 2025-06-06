import mongoose from "mongoose";
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

// Get all vendors
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("userId", "username email role status");
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get vendor by ID
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

// Get vendor by userId
export const getVendorByUserId = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.params.userId }).populate("userId", "username email role status");
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update vendor
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

// Delete vendor by userId
export const deleteVendorByUserId = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        const vendor = await Vendor.findOneAndDelete({ userId });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Vendor and User deleted successfully" });
    } catch (error) {
        console.error("Error deleting vendor and user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Approve vendor
export const approveVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
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

// Reject vendor
export const rejectVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
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

// Unapprove vendor (set to Pending)
export const unapproveVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
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
