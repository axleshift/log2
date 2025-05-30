import express from "express";
import { createVendor, getAllVendors, getVendorByUserId, getVendorById, updateVendor, deleteVendorByUserId, approveVendor, rejectVendor, unapproveVendor } from "../../controller/vendor.js";

const router = express.Router();

router.post("/create", createVendor);
router.get("/user/:userId", getVendorByUserId);
router.get("/", getAllVendors);
router.get("/:id", getVendorById);
router.put("/:id", updateVendor);
router.delete("/user/:userId", deleteVendorByUserId);
router.put("/approve/:id", approveVendor);
router.put("/reject/:id", rejectVendor);
router.put("/unapprove/:id", unapproveVendor);

export default router;
