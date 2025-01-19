import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d",
    },
});

refreshTokenSchema.methods.isValid = function () {
    return !!this.token;
};

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
