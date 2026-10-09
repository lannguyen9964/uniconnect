import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserProfilePicture from "./UserProfilePicture";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";



const PrivateMessageCard = ({ convo }: { convo: Conversation }) => {

    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();
    const { onlineUsers } = useSocketStore();

    if (!user) {
        return null;
    }

    const friend = convo.participants.find((p) => p._id !== user._id);

    if (!friend) {
        return null;
    }

    const unreadCount = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.content ?? "";

    const handleSelectConvo = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            // fetch messages
            await fetchMessages();
        }
    }
    return <ChatCard
        convoId={convo._id}
        name={friend.displayName ?? ""}
        timestamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
        isActive={activeConversationId === convo._id}
        onSelect={handleSelectConvo}
        unreadCount={unreadCount}
        leftSection={
            <>
                <UserProfilePicture type="chat" name={friend.displayName ?? ""} profilePictureUrl={friend.profilePictureUrl ?? undefined} />
                <StatusBadge status={onlineUsers.includes(friend?._id ?? "") ? "online" : "offline"} />
                {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
            </>
        }
        subtitle={< p className={cn("text-sm truncate", unreadCount > 0 ? "font-medium" : "text-muted-foreground")}> {lastMessage}</p >}
    />

};

export default PrivateMessageCard;
