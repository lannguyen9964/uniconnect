import { useChatStore } from "@/stores/useChatStore";
import { SidebarMenu } from "@/components/ui/sidebar";
import PrivateMessageCard from "./PrivateMessageCard"



const PrivateChatList = () => {

    const { conversations } = useChatStore();
    if (!conversations) {
        return;
    }

    const privateConversations = conversations.filter((convo) => convo.type === 'private');

    if (privateConversations.length === 0) {
        return <p className="px-3 py-2 text-xs text-muted-foreground">No chats yet</p>;
    }

    return (
        <SidebarMenu className="gap-2">
            {
                privateConversations.map((convo) => (
                    <PrivateMessageCard key={convo._id} convo={convo}
                    />
                ))
            }
        </SidebarMenu>
    )
};

export default PrivateChatList;
