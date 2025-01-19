import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "super admin", "auditor", "staff", "inventory manager", "procurement manager", "regional manager", "user", "supplier", "vendor", "buyer", "finance", "temporary staff", "delivery partner", "customer support"],
            required: true,
        },
        resetPasswordOtp: {
            type: String,
        },
        resetPasswordOtpExpires: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Banned"],
            default: "Active",
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export const findUserByUsername = async (username) => {
    const user = await UserModel.findOne({ username }).lean();
    return user;
};

export default UserModel;
