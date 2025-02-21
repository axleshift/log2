import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User who created the department
    createdAt: { type: Date, default: Date.now },
});

const Department = mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;
