import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectedRoute = async (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    // Verify the token. Synchronous form, so a bad token throws here and nowhere else.
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.error("Error verifying access token:", error);
        return res.status(403).json({ message: "Invalid or expired access token" });
    }

    // Look up the user. A failure here is a server problem, not a bad token.
    try {
        const user = await User.findById(decodedUser.userId).select("-password"); // Exclude password from the user object

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach the user object to the request for further use in the route handler
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protected route middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
