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
            enum: ['admin'],
            default: 'admin' // Default role is admin 
        },
        resetPasswordOtp: { // This stores the OTP in the database
            type: String,
            default: null, // Initialize with null
        },
        resetPasswordOtpExpires: { // Stores OTP expires time
            type: Date,
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
