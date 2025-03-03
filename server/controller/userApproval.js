import User from "../models/UserModel.js";

const updateUserStatus = async (req, res, status, successMessage, errorMessage) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            console.warn(`${status} request missing userId`);
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        if (user.status === status) {
            return res.status(400).json({ status: "error", message: errorMessage });
        }

        user.status = status;
        await user.save();

        return res.json({ status: "success", message: successMessage, user });
    } catch (error) {
        console.error(`Error updating user status to ${status}:`, error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

// Approve User
export const approveUser = (req, res) => updateUserStatus(req, res, "Approved", "User approved successfully", "User is already approved");

// Cancel Approval (Revert back to Pending)
export const cancelApproval = (req, res) => updateUserStatus(req, res, "Pending", "Approval canceled successfully", "User is already pending");
