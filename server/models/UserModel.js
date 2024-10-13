import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
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
    preferences: {
        type: Object,
        default: {},
    },
    activityHistory: {
        type: Array,
        default: [],
    },
});

// Model declaration
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
