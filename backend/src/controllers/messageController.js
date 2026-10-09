import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { emitNewMessage, updateConversation } from "../utils/messageHelper.js";
import { io } from "../socket/index.js"




// DM = Direct Message
export const sendDM = async (req, res) => {
    try {
        const { recipientId, content, conversationId } = req.body;
        const senderId = req.user._id;

        let conversation;

        if (!content) {
            return res.status(400).json({ message: "Missing content" });
        }

        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        if (!conversation) {
            conversation = await Conversation.create({
                type: "private",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            });
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
        });

        updateConversation(conversation, message, senderId);

        await conversation.save();


        emitNewMessage(io, conversation, message);

        return res.status(201).json({ message });

    } catch (error) {
        console.error("Error sending direct message", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}




// GM = Group Message
export const sendGM = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.user._id;
        const conversation = req.conversation;

        if (!content) {
            return res.status(400).json({ message: "Missing content" });
        }

        const message = await Message.create({
            conversationId,
            senderId,
            content
        });

        updateConversation(conversation, message, senderId);

        await conversation.save();

        emitNewMessage(io, conversation, message);

        return res.status(201).json({ message });
    } catch (error) {
        console.error("Error sending group messages", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
}