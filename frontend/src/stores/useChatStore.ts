import { create } from "zustand";
import type { ChatState } from "@/types/store";
import { persist } from "zustand/middleware";
import { chatService } from "@/services/chatService";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            convoLoading: false, // convo loading
            messageLoading: false,
            pagingLoading: false, // loading an older page, the window stays mounted

            setActiveConversation: (id) => set({ activeConversationId: id }),
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    convoLoading: false,
                    messageLoading: false,
                    pagingLoading: false
                })
            },
            fetchConversations: async () => {
                try {
                    set({ convoLoading: true });
                    const { conversations } = await chatService.fetchConversations();
                    set({ conversations, convoLoading: false });
                } catch (error) {
                    console.error("Error fetching conversations", error);
                    set({ convoLoading: false });
                }

            },
            fetchMessages: async (conversationId) => {
                const { activeConversationId, messages } = get();
                const { user } = useAuthStore.getState();

                const convoId = conversationId ?? activeConversationId;

                if (!convoId) {
                    return;
                }

                const currentMsg = messages?.[convoId];
                const nextPtr = currentMsg?.nextPtr === undefined ? "" : currentMsg?.nextPtr;

                if (nextPtr === null) {
                    return;
                }

                // the first page blocks the window, older pages load underneath it
                const isPaging = (currentMsg?.items?.length ?? 0) > 0;
                set(isPaging ? { pagingLoading: true } : { messageLoading: true });

                try {
                    const { messages: fetched, pointer } = await chatService.fetchMessages(convoId, nextPtr);

                    const processed = fetched.map((m) => ({
                        ...m,
                        isOwn: m.senderId === user?._id
                    }));

                    set((state) => {
                        const prev = state.messages[convoId]?.items ?? [];
                        const merged = prev.length > 0 ? [...processed, ...prev] : processed;

                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: merged,
                                    hasMoreMsg: !!pointer,
                                    nextPtr: pointer ?? null
                                }
                            }
                        }
                    });
                } catch (error) {
                    console.error("Error fetching messages:", error);

                } finally {
                    set(isPaging ? { pagingLoading: false } : { messageLoading: false });
                }
            },
            sendPrivateMessage: async (recipientId, content, imgUrl) => {
                try {
                    const { activeConversationId } = get();
                    await chatService.sendPrivateMessage(recipientId, content, imgUrl, activeConversationId || undefined);

                    set((state) => ({
                        conversations: state.conversations.map((c) => c._id === activeConversationId ? { ...c, seenBy: [] } : c)
                    }));
                } catch (error) {
                    console.error("Error sending private message", error);
                }

            },
            sendGroupMessage: async (conversationId, content, imgUrl) => {
                try {
                    await chatService.sendGroupMessage(conversationId, content, imgUrl);

                    set((state) => ({
                        conversations: state.conversations.map((c) =>
                            c._id === state.activeConversationId ? { ...c, seenBy: [] } : c)
                    }));

                } catch (error) {
                    console.error("Error sending group message", error);
                }
            },
            addMessage: async (message) => {
                try {
                    const { user } = useAuthStore.getState();
                    const { fetchMessages } = get();

                    message.isOwn = message.senderId === user?._id;

                    const convoId = message.conversationId;

                    let prevItems = get().messages[convoId]?.items ?? [];

                    if (prevItems.length === 0) {
                        await fetchMessages(message.conversationId);
                        prevItems = get().messages[convoId]?.items ?? [];
                    }

                    set((state) => {
                        if (prevItems.some((m) => m._id === message._id)) {
                            return state;
                        }

                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: [...prevItems, message],
                                    hasMoreMsg: state.messages[convoId].hasMoreMsg,
                                    nextPtr: state.messages[convoId].nextPtr ?? undefined,
                                },
                            },
                        };
                    });
                } catch (error) {
                    console.error("Error adding message", error);
                }
            },
            updateConversation: (conversation) => {
                set((state) => ({
                    conversations: state.conversations.map((c) =>
                        c._id === conversation._id ? { ...c, ...conversation } : c
                    ),
                }));
            },
            markAsSeen: async () => {
                try {
                    const { user } = useAuthStore.getState();
                    const { activeConversationId, conversations } = get();

                    if (!activeConversationId || !user) {
                        return;
                    }

                    const convo = conversations.find((c) => c._id === activeConversationId);

                    if (!convo) {
                        return;
                    }

                    if ((convo.unreadCounts?.[user._id] ?? 0) === 0) {
                        return;
                    }

                    await chatService.markAsSeen(activeConversationId);

                    set((state) => ({
                        conversations: state.conversations.map((c) => (c._id == activeConversationId && c.lastMessage ? {
                            ...c,
                            unreadCounts: {
                                ...c.unreadCounts,
                                [user._id]: 0
                            }
                        } : c))
                    }));
                } catch (error) {
                    console.error("Error calling mark as seen", error);
                }
            }
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({ conversations: state.conversations })
        }
    )
)
