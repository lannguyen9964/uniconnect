import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";





const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
    const { user } = useAuthStore();
    const [value, setValue] = useState("");
    const { sendPrivateMessage, sendGroupMessage } = useChatStore();

    if (!user) {
        return;
    }

    const sendMessage = async () => {

        if (!value.trim()) {
            return;
        }

        const currentValue = value;
        setValue("");


        try {
            if (selectedConvo.type === "private") {
                const participants = selectedConvo.participants;
                const friend = participants.filter((p) => p._id !== user._id)[0];
                await sendPrivateMessage(friend._id, currentValue);
            } else {
                await sendGroupMessage(selectedConvo._id, currentValue);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error sending message!");
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !(e.nativeEvent as KeyboardEvent).isComposing) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex items-center gap-2 p-3 min-h-[56px] bg-background">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth">
                <ImagePlus className="size-4" />
            </Button>

            <div className="flex-1 relative ">
                <Input onKeyDown={handleKeyDown} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Message..." className="pr-20 h-9 border-border/50 focus:border-primary transition-smooth resize-none">

                </Input>

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <EmojiPicker onSelect={(emoji: string) => setValue(`${value}${emoji}`)} />
                </div>

            </div>

            <Button onClick={sendMessage} className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105" disabled={!value.trim()}>
                <Send className="size-4 text-white" />
            </Button>

        </div>
    );
};

export default MessageInput;
