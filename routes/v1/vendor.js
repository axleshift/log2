import express from "express";
import mongoose from "mongoose";
import { getAllVendorsWithUserDetails, getAllVendors, getVendorById, updateVendor, deleteVendor, approveVendor, rejectVendor, unapproveVendor } from "../../controller/vendor.js";

const router = express.Router();

router.get("/with-users", getAllVendorsWithUserDetails);
router.get("/", getAllVendors);
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid vendor ID" });
    }
    return getVendorById(req, res, next);
});

router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);
router.put("/approve/:id", approveVendor);
router.put("/reject/:id", rejectVendor);
router.put("/unapprove/:id", unapproveVendor);

export default router;
