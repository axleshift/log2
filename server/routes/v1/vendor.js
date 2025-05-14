import express from "express";
import { getAllVendorsWithUserDetails, getAllVendors, updateVendor, deleteVendor, approveVendor, rejectVendor, unapproveVendor } from "../../controller/vendor.js";

const router = express.Router();

router.get("/with-users", getAllVendorsWithUserDetails);
router.get("/", getAllVendors);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);
router.put("/approve/:id", approveVendor);
router.put("/reject/:id", rejectVendor);
router.put("/unapprove/:id", unapproveVendor);

export default router;
