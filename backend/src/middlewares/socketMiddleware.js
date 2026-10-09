import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedUser.userId).select("-password");

        if (!user) {
            return next(new Error("User does not exist"));
        }

        socket.user = user;
        next();
    } catch (error) {
        console.error("Error verifying JWT", error);
        next(new Error("Unauthorized"));
    }
}