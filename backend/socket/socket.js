import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

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
  if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //OUTPUT [1,2,3] // array of ids

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      // find all messages of conversationId with seen:false and make seen:true.
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );

      // Send real-time notification to the user that messages have been seen
      if (userSocketMap[userId]) {
        io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
      }
    } catch (error) {
      console.log("Error marking messages as seen:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit online users
    }
  });
});

export { io, server, app };
