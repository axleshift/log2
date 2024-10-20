import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true }, // Added index for performance
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" }, // Automatically delete after 7 days
});

// Method to validate the token
refreshTokenSchema.methods.isValid = function () {
    return !!this.token; // Simple check to see if the token exists
};

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshTokenModel;
