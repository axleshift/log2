import Department from "../models/department.js";

// Create Department
export const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const createdBy = req.user._id;

        const department = new Department({ name, description, createdBy });
        await department.save();
        res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create department", error });
    }
};

// Get all Departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate("createdBy", "username"); // Populate createdBy field to get user name
        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch departments", error });
    }
};

// Get a single Department by ID
export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate("createdBy", "name");
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.status(200).json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch department", error });
    }
};

// Update Department
export const updateDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        if (!updatedDepartment) return res.status(404).json({ message: "Department not found" });
        res.status(200).json(updatedDepartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update department", error });
    }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
    try {
        const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDepartment) return res.status(404).json({ message: "Department not found" });
        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete department", error });
    }
};
