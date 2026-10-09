import User from "../models/user.js";

export const getMe = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

};

export const findUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ username }).select("_id displayName username profilePictureUrl");

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error finding user by username:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

};