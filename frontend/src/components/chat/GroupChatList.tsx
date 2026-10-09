import { useChatStore } from "@/stores/useChatStore";
import { SidebarMenu } from "@/components/ui/sidebar";
import GroupMessageCard from "./GroupMessageCard";




const GroupChatList = () => {
    const { conversations } = useChatStore();
    if (!conversations) {
        return;
    }

    const groupConversations = conversations.filter((convo) => convo.type === 'group');

    if (groupConversations.length === 0) {
        return <p className="px-3 py-2 text-xs text-muted-foreground">No groups yet</p>;
    }

    return (
        <SidebarMenu className="gap-2">
            {
                groupConversations.map((convo) => (
                    <GroupMessageCard key={convo._id} convo={convo}
                    />
                ))
            }
        </SidebarMenu>
    )
};

export default GroupChatList;
