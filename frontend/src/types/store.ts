import type { FriendRequest, User } from "./user";
import type { Conversation } from "./chat";
import type { Message } from "./chat";
import type { Socket } from "socket.io-client";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    clearSession: () => void;

    signUp: (username: string, password: string, email: string, firstName: string, lastName: string) => Promise<void>;
    /** false when the credentials were rejected, so callers can skip redirecting */
    signIn: (username: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    setAccessToken: (accessToken: string) => void;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

export interface ChatState {
    conversations: Conversation[];
    messages: Record<string, {
        items: Message[],
        hasMoreMsg: boolean, // infinite scroll
        nextPtr?: string | null
    }>;
    activeConversationId: string | null;
    convoLoading: boolean;
    messageLoading: boolean;
    /** true only while an older page is loading, so the chat window stays mounted */
    pagingLoading: boolean;
    reset: () => void;

    setActiveConversation: (id: string | null) => void;
    fetchConversations: () => void;
    fetchMessages: (conversationId?: string) => Promise<void>;

    sendPrivateMessage: (recipientId: string, content: string, imgUrl?: string) => Promise<void>;

    sendGroupMessage: (conversationId: string, content: string, imgUrl?: string) => Promise<void>;

    addMessage: (message: Message) => Promise<void>;

    updateConversation: (conversation: Conversation) => void;

    markAsSeen: () => Promise<void>;



}

export interface SocketState {
    socket: Socket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
    onlineUsers: string[];
}

export interface FriendState {
    loading: boolean;
    findByUsername: (username: string) => Promise<User | null>;
    /** resolves to the message the API returned, so the caller can toast it */
    addFriend: (to: string, message?: string) => Promise<string>;

    receivedFriendRequests: FriendRequest[];
    sentFriendRequests: FriendRequest[];
    getAllFriendRequests: () => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    declineFriendRequest: (requestId: string) => Promise<void>;
}