import { MessageCircle, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

/** shown in the chat window when no conversation is selected. UI only for now. */
const ChatWelcomeScreen = () => {
    const { user } = useAuthStore();
    const firstName = user?.firstName || user?.displayName;

    return (
        <SidebarInset className="flex w-full h-full bg-transparent">
            <ChatWindowHeader />
            <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
                <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-primary text-white shadow-glow">
                    <MessageCircle className="size-10" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back{firstName ? `, ${firstName}` : ""}
                    </h1>
                    <p className="text-muted-foreground">
                        Pick a conversation from the sidebar, or start a new one.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5">
                    <Button size="lg" className="h-10 rounded-xl px-4">
                        <Plus />
                        New chat
                    </Button>
                    <Button variant="outline" size="lg" className="h-10 rounded-xl px-4">
                        <UserPlus />
                        Add friend
                    </Button>
                </div>
            </div>
        </SidebarInset>
    )
};

export default ChatWelcomeScreen;
