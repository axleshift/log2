import UserModel from "../models/UserModel.js";

// Fetch all users
export const getAllUsers = async () => {
    try {
        return await UserModel.find();
    } catch (error) {
        throw new Error("Error fetching all users: " + error.message);
    }
};

export const createUser = async (userData) => {
    try {
        const user = new UserModel(userData);
        return await user.save();
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
};

export const findUserByEmail = async (email) => {
    try {
        return await UserModel.findOne({ email });
    } catch (error) {
        throw new Error("Error finding user by email: " + error.message);
    }
};

export const findUserByUsername = async (username) => {
    try {
        return await UserModel.findOne({ username });
    } catch (error) {
        throw new Error("Error finding user by username: " + error.message);
    }
};

export const updateUserById = async (userId, updateData) => {
    try {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
        throw new Error("Error updating user: " + error.message);
    }
};

export const deleteUserById = async (userId) => {
    try {
        return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error("Error deleting user: " + error.message);
    }
};
