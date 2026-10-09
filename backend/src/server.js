import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './libs/db.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js'
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { app } from './socket/index.js';
import { server } from "./socket/index.js"

dotenv.config();

const PORT = process.env.PORT || 5001;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS for the frontend

// swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf-8"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// public routes
app.use('/api/auth', authRoutes);

// private routes
app.use(protectedRoute);
app.use('/api/user', userRoutes);
app.use('/api/friends', friendRoutes); // Use the friend routes
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

connectDB().then(() => {
    // Define your routes here
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});