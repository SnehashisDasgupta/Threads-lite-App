import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId]; // recipientId = userId
};

const userSocketMap = {}; // map to store [userId : socket.Id] for online user indication

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //OUTPUT [1,2,3] // array of ids

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // after logging out, the changes will be shown[online status will be removed]
  });
});

export { io, server, app };
