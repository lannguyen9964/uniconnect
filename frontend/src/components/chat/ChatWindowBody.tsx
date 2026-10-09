import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";




const ChatWindowBody = () => {
    const { activeConversationId, conversations, messages: allMsg, fetchMessages } = useChatStore();

    const [lastMessageStatus, setLastMessageStatus] = useState<"delivered" | "seen">("delivered");

    const messages = allMsg[activeConversationId!]?.items ?? [];
    const hasMoreMsg = allMsg[activeConversationId!]?.hasMoreMsg ?? false;

    const selectedConvo = conversations.find((c) => c._id === activeConversationId);

    const endOfMsgRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    // refs, not state: two observer callbacks would both pass an async state check
    const loadingRef = useRef(false);
    const anchorRef = useRef<number | null>(null);


    useEffect(() => {
        const lastMessage = selectedConvo?.lastMessage;
        if (!lastMessage) {
            return;
        }

        const seenBy = selectedConvo?.seenBy ?? [];

        setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
    }, [selectedConvo]);

    // jump to the newest message when a conversation opens
    useLayoutEffect(() => {
        if (!endOfMsgRef.current) {
            return;
        }

        endOfMsgRef.current.scrollIntoView({ block: "end" })

    }, [activeConversationId])

    // ask for an older page once the top of the list comes into view
    useEffect(() => {
        const container = containerRef.current;
        const sentinel = topSentinelRef.current;

        if (!container || !sentinel || !hasMoreMsg || !activeConversationId) {
            return;
        }

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting || loadingRef.current) {
                    return;
                }

                loadingRef.current = true;
                anchorRef.current = container.scrollHeight; // height before the prepend

                try {
                    await fetchMessages(activeConversationId);
                } catch (error) {
                    console.error("Error fetching more messages", error);
                    anchorRef.current = null;
                } finally {
                    loadingRef.current = false;
                }
            },
            { root: container, rootMargin: "200px 0px 0px 0px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [activeConversationId, hasMoreMsg, fetchMessages, messages.length]);

    // keep the viewport on the same message after older ones are prepended
    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container || anchorRef.current === null) {
            return;
        }

        container.scrollTop += container.scrollHeight - anchorRef.current;
        anchorRef.current = null;
    }, [messages.length]);

    if (!selectedConvo) {
        return <ChatWelcomeScreen />;
    }

    if (!messages?.length) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                No messages
            </div>
        )
    }

    return (
        <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
            <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden prettier-scrollbar">
                <div ref={topSentinelRef}></div>

                {hasMoreMsg && (
                    <p className="py-2 text-center text-xs text-muted-foreground">Loading…</p>
                )}

                {messages.map((message, index) => (
                    <MessageItem key={message._id ?? index} message={message} index={index} messages={messages} selectedConvo={selectedConvo} lastMessageStatus={lastMessageStatus} />
                ))}

                <div ref={endOfMsgRef}></div>
            </div>
        </div>
    );
};

export default ChatWindowBody;
