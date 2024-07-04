import { text } from "express";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    // find the conversation where the current senderId and recipientId is present.
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    // if no conversation is present, then made one new conversation with current senderId and recipientId.
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    //find the conversation with the help of senderId and receiverId
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // find all messages from conversation
    // sort({createdAt: 1}) sort messages in decending order [new message at the bottom]
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
    const userId = req.user._id;
    try {
        // find all conversations of the currentUser and fetch username and profilePic of otherUsers
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username profilePic",
        })

        res.status(200).json(conversations);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { sendMessage, getMessages, getConversations };
