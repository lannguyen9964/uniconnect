import bcrypt from 'bcrypt'
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/session.js';

const ACCESS_TOKEN_TTL = '15m' // Access token time to live (15 minutes)
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000 // Refresh token time to live (7 days)

export const registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;

        if (!username || !firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10

        // Create new user
        await User.create({
            username,
            firstName,
            lastName,
            email,
            displayName: `${firstName} ${lastName}`,
            password: hashedPassword,
        });

        return res.sendStatus(204);
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // if login is successful, generate access token (JWT)
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // Generate refresh token (JWT)
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // New session to save refresh token in the database
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        // send refresh token as cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // different domain deployment
            maxAge: REFRESH_TOKEN_TTL
        });

        return res.status(200).json({
            message: `${user.displayName} logged in successfully!`,
            accessToken
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Extract refresh token from cookies
        const token = req.cookies?.refreshToken;

        if (token) {
            // Delete refresh token in session
            await Session.deleteOne({ refreshToken: token });

            // Clear the refresh token cookie
            res.clearCookie('refreshToken');
        }


        return res.sendStatus(204);

    } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// new access token using refresh token
export const refreshToken = async (req, res) => {
    try {
        // Extract refresh token from cookies

        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        // compare the refresh token in the cookie with the one in the database
        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // check if the refresh token is valid and not expired
        if (session.expiresAt < new Date()) {
            return res.status(403).json({ message: "Refresh token expired" });
        }

        // generate a new access token
        const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // return the new access token in the response
        return res.status(200).json({ accessToken });

    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};