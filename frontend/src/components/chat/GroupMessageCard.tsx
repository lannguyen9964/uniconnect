import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";




const GroupMessageCard = ({ convo }: { convo: Conversation }) => {

    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();

    if (!user) {
        return null;
    }

    const otherUser = convo.participants.find((p) => p._id !== user._id);

    if (!otherUser) {
        return null;
    }

    const unreadCount = convo.unreadCounts[user._id];
    const gName = convo.group?.name ?? "";
    const handleSelectConvo = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            // fetch messages
            await fetchMessages();
        }
    }

    return (
        <ChatCard
            convoId={convo._id}
            name={gName}
            timestamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
            isActive={activeConversationId === convo._id}
            onSelect={handleSelectConvo}
            unreadCount={unreadCount}
            leftSection={
                <>
                    {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
                    <GroupChatAvatar participants={convo.participants} type="chat" />
                </>}
            subtitle={<p className="text-sm truncate text-muted-foreground">
                {convo.participants.length}
            </p>}
        />
    )
};

export default GroupMessageCard;
