import Profile from "../models/profileModel.js";

// Create a new profile
export const createProfile = async (req, res) => {
    try {
        const { user, firstName, lastName, email, bio, phone, address, city, state, zipcode, avatar } = req.body;

        const newProfile = new Profile({
            user,
            firstName,
            lastName,
            email,
            bio,
            phone,
            address,
            city,
            state,
            zipcode,
            avatar,
        });

        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a profile by user ID
export const getProfileByUserId = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a profile by user ID
export const updateProfile = async (req, res) => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a profile by user ID
export const deleteProfile = async (req, res) => {
    try {
        const deletedProfile = await Profile.findOneAndDelete({ user: req.user.id });
        if (!deletedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
