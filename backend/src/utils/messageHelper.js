
// update conversation after creating new message
export const updateConversation = (conversation, message, senderId) => {
    conversation.set({
        seenBy: [],
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt
        },
        lastMessageAt: message.createdAt
    });

    conversation.participants.forEach((p) => {
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const prevCount = conversation.unreadCounts.get(memberId) || 0;
        conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1)
    })
};

export const emitNewMessage = (io, conversation, message) => {
    io.to(conversation._id.toString()).emit("new-message", {
        message,
        conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
        },
        // a Map does not survive socket.emit, it arrives as {}
        unreadCounts: Object.fromEntries(conversation.unreadCounts ?? []),
    });
};