import express from "express";
import { createLogistics, getLogistics, getLogisticsById, updateLogisticsById, deleteLogisticsById } from "../../controller/logisticsController.js";

const router = express.Router();

router.post("/", createLogistics);
router.get("/", getLogistics);
router.get("/:id", getLogisticsById);
router.put("/:id", updateLogisticsById);
router.delete("/:id", deleteLogisticsById);

export default router;
