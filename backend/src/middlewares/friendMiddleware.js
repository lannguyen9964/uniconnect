import Conversation from "../models/conversation.js";
import Friendship from "../models/friendship.js";

const pair = (id1, id2) => (id1 < id2 ? [id1, id2] : [id2, id1]);


export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();

        const recipientId = req.body?.recipientId ?? null;

        if (!recipientId) {
            return res.status(400).json({ message: "Missing recipientId" });
        }

        if (recipientId) {
            const [user1, user2] = pair(me, recipientId);
            const isFriend = await Friendship.findOne({ user1, user2 })

            if (!isFriend) {
                return res.status(403).json({ message: "You are not friend with this user" })
            }

            return next();
        }

        // group message

    } catch (error) {
        console.error("Error checking friendship", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkGroupMembership = async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const isMember = conversation.participants.some((p) => p.userId.toString() === userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: "You are not in this group" });
        }

        req.conversation = conversation;
        next();
    } catch (error) {
        console.error("Error checking group membership", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}