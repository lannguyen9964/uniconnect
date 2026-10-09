import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversations } from "../controllers/conversationController.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map();

io.on("connection", async (socket) => {
    const user = socket.user;
    onlineUsers.set(user._id, socket.id);

    console.log(`${user.displayName} is online: ${socket.id}`);


    io.emit("online-users", Array.from(onlineUsers.keys()));

    const conversationIds = await getUserConversations(user._id);
    conversationIds.forEach((id) => {
        socket.join(id);
    });


    socket.on("disconnect", () => {
        onlineUsers.delete(user._id);
        io.emit("online-users", Array.from(onlineUsers.keys()));


        console.log(`socket disconnected: ${socket.id}`);
    });
});


export { io, server, app };