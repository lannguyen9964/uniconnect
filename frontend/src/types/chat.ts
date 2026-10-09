export interface Conversation {
    _id: string;
    type: "private" | "group";
    group: Group;
    participants: Participant[];
    lastMessageAt: string;
    seenBy: SeenUser[];
    lastMessage: LastMessage | null;
    unreadCounts: Record<string, number>;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationResponse {
    conversations: Conversation[];
}

export interface Group {
    name: string;
    createdBy: string;
}

export interface Participant {
    _id: string;
    displayName: string;
    profilePictureUrl?: string | null;
    joinedAt: string;
}


export interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    content: string | null;
    profilePictureUrl?: string | null;
    updatedAt?: string | null;
    createdAt: string;
    isOwn?: boolean;
}



export interface LastMessage {
    _id: string;
    content: string;
    createdAt: string;
    sender: {
        _id: string;
        displayName: string;
        profilePictureUrl?: string | null;
    };
}

export interface SeenUser {
    _id: string;
    displayName?: string;
    profilePictureUrl?: string | null;
}

