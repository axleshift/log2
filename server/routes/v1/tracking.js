import express from "express";
import { createTracking, getAllTrackings, getTrackingById, updateTracking, deleteTracking } from "../../controller/trackingController.js";

const router = express.Router();

router.post("/", createTracking);
router.get("/", getAllTrackings);
router.get("/:id", getTrackingById);
router.put("/:id", updateTracking);
router.delete("/:id", deleteTracking);

export default router;
