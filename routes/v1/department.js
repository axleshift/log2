import express from "express";
import { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "../../controller/department.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create Department
router.post("/", tokenMiddleware, createDepartment);

// Get all Departments
router.get("/", tokenMiddleware, getDepartments);

// Get a single Department by ID
router.get("/:id", tokenMiddleware, getDepartmentById);

// Update Department
router.put("/:id", tokenMiddleware, updateDepartment);

// Delete Department
router.delete("/:id", tokenMiddleware, deleteDepartment);

export default router;
