import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        avatar: { type: String },
        bio: { type: String },
        email: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipcode: { type: String },
    },
    { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
