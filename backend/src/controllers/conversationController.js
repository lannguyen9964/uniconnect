import Conversation from "../models/conversation.js";
import Message from "../models/message.js"
import { io } from "../socket/index.js";




// The single definition of the conversation shape this API returns.
// Mongoose stores participants as { userId: <user>, joinedAt }, but the client
// reads a flat participant. Every endpoint that returns a conversation goes
// through here, so a created one and a fetched one are never shaped differently.
const formatConversation = (convo) => {
    // flattenMaps: toObject() keeps unreadCounts as a Map, and a Map serializes to {}
    const obj = typeof convo.toObject === "function" ? convo.toObject({ flattenMaps: true }) : convo;

    const participants = (obj.participants || []).map((p) => ({
        // `userId` is a populated user document when populated, a raw id when not.
        _id: p.userId?._id ?? p.userId ?? null,
        displayName: p.userId?.displayName ?? null,
        profilePictureUrl: p.userId?.profilePictureUrl ?? null,
        joinedAt: p.joinedAt ?? null
    }));

    return {
        ...obj,
        participants,
        unreadCounts: obj.unreadCounts instanceof Map ? Object.fromEntries(obj.unreadCounts) : (obj.unreadCounts || {})
    };
};

export const createConversation = async (req, res) => {
    try {
        const { type, name, memberIds } = req.body;
        const userId = req.user._id;

        if (!type || (type === 'group' && !name) || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({ message: "Group name and list of members are required" });
        }

        let conversation;

        if (type === 'private') {
            const participantId = memberIds[0];

            conversation = await Conversation.findOne({ type: 'private', "participants.userId": { $all: [userId, participantId] } });

            if (!conversation) {
                conversation = new Conversation({
                    type: 'private',
                    participants: [{ userId }, { userId: participantId }],
                    lastMessageAt: new Date()

                });

                await conversation.save();
            }
        }

        if (type === 'group') {
            conversation = new Conversation({
                type: 'group',
                participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
                group: {
                    name,
                    createdBy: userId
                },
                lastMessageAt: new Date()
            });

            await conversation.save();
        }

        if (!conversation) {
            return res.status(400).json({ message: "Invalid conversation type" });
        }

        await conversation.populate([
            { path: "participants.userId", select: "displayName profilePictureUrl" },
            { path: "seenBy", select: "displayName profilePictureUrl" },
            { path: "lastMessage.senderId", select: "displayName profilePictureUrl" }
        ]);

        return res.status(201).json({ conversation: formatConversation(conversation) });

    } catch (error) {
        console.error("Error creating conversation", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            'participants.userId': userId
        }).sort({ lastMessageAt: -1, updatedAt: -1 }).populate({
            path: "participants.userId",
            select: "displayName profilePictureUrl"
        }).populate({
            path: "seenBy",
            select: "displayName profilePictureUrl"
        });

        const formatted = conversations.map(formatConversation);

        return res.status(200).json({ conversations: formatted });
    } catch (error) {
        console.error("Error fetching conversations", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit = 50, pointer } = req.query;

        const query = { conversationId };

        if (pointer) {
            query.createdAt = { $lt: new Date(pointer) }; // BUG FIX 2: Typo 'createAt' -> 'createdAt'
        }

        let messages = await Message.find(query).sort({ createdAt: -1 }).limit(Number(limit) + 1);


        let nextPtr = null;

        if (messages.length > Number(limit)) {
            const nextMsg = messages[messages.length - 1];
            nextPtr = nextMsg.createdAt.toISOString();
            messages.pop();
        }

        messages = messages.reverse();
        return res.status(200).json({ messages, nextPtr });
    } catch (error) {
        console.error("Error fetching messages", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserConversations = async (userId) => {
    try {
        const conversations = await Conversation.find(
            { "participants.userId": userId },
            { _id: 1 }
        );
        return conversations.map((c) => c._id.toString());
    } catch (error) {
        console.error("Error fetching conversations", error);
        return [];
    }
};

export const markAsSeen = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id.toString();

        const conversation = await Conversation.findById(conversationId).lean();

        if (!conversation) {
            return res.status(404).json({ message: "Conversation does not exist" });
        }

        const last = conversation.lastMessage;

        if (!last) {
            return res.status(200).json({ message: "No messages to mark as seen" });
        }

        if (last.senderId.toString() === userId) {
            return res.status(200).json({ message: "Sender does not need to mark as seen" });
        }

        const updated = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $addToSet: { seenBy: userId },
                $set: { [`unreadCounts.${userId}`]: 0 }
            },
            {
                returnDocument: 'after'
            });

        // only the fields that changed: sending the whole document would overwrite
        // the flattened participants the client built from GET /conversations
        io.to(conversationId).emit("read-message", {
            conversation: {
                _id: conversationId,
                seenBy: updated?.seenBy ?? [],
                unreadCounts: Object.fromEntries(updated?.unreadCounts ?? []),
            },
            lastMessage: {
                _id: updated?.lastMessage._id,
                content: updated?.lastMessage.content,
                createdAt: updated?.lastMessage.createdAt,
                sender: {
                    _id: updated?.lastMessage.senderId
                }
            }
        });

        return res.status(200).json({ message: "Marked as seen", seenBy: updated?.seenBy || [], myUnreadCount: updated?.unreadCounts?.get(userId) || 0 });

    } catch (error) {
        console.error("Error marking as seen", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}