import { PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import UserProfilePicture from "./UserProfilePicture";
import GroupChatAvatar from "./GroupChatAvatar";
import type { Conversation } from "@/types/chat";
import { useChatStore } from "@/stores/useChatStore";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "./StatusBadge";
import { useSocketStore } from "@/stores/useSocketStore";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {

    const { conversations, activeConversationId } = useChatStore();
    const { user } = useAuthStore();
    const { onlineUsers } = useSocketStore();

    let friend;


    chat = chat ?? conversations.find((c) => c._id === activeConversationId);

    if (!chat) {
        return (
            <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
                <SidebarTrigger className="-ml-1 text-foreground" />
            </header>
        )
    }

    if (chat.type === "private") {
        const others = chat?.participants.filter((p) => p._id !== user?._id) ?? [];
        friend = others.length > 0 ? others[0] : null;

        if (!user || !friend) {
            return;
        }
    }

    return (
        <header className="flex h-16 shrink-0 items-center gap-3 border-b px-3 md:px-5 sticky top-0 z-10 bg-background">
            <SidebarTrigger className="md:hidden text-foreground" />
            <Separator orientation="vertical" className="md:hidden data-[orientation=vertical]:h-4" />

            {/* Profile Pic*/}
            <div className="relative shrink-0">
                {
                    chat.type === "private" ? (
                        <>
                            <UserProfilePicture type={"sidebar"} name={friend?.displayName || "UniConnect"} profilePictureUrl={friend?.profilePictureUrl || undefined} />
                            <StatusBadge status={onlineUsers.includes(friend?._id ?? "") ? "online" : "offline"} />
                        </>
                    ) : (
                        <GroupChatAvatar participants={chat.participants} type="sidebar" />
                    )
                }
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="truncate font-semibold text-foreground">
                    {chat.type === "private" ? friend?.displayName : chat.group?.name}
                </h2>
                <p className="truncate text-xs text-muted-foreground">
                    {chat.type === "private" ? "Friend" : `${chat.participants.length} members`}
                </p>
            </div>

            <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Conversation details"
                className="hidden rounded-xl lg:inline-flex"
            >
                <PanelRight />
            </Button>
        </header>
    )
};

export default ChatWindowHeader;
