import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "super admin", "user", "vendor", "buyer", "finance"], required: true },
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "Active"], default: "Active" }, // Ensure "Active" is a valid option
        resetPasswordOtp: { type: String },
        resetPasswordOtpExpires: { type: Date },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export const findUserByUsername = async (username) => {
    return await UserModel.findOne({ username }).lean();
};

export default UserModel;
