import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserProfilePicture from "./UserProfilePicture";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";


interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectedConvo: Conversation;
    lastMessageStatus: "delivered" | "seen";

}


const MessageItem = ({ message, index, messages, selectedConvo, lastMessageStatus }: MessageItemProps) => {

    // messages are oldest first, so prev is the one above and next the one below
    const prev = index > 0 ? messages[index - 1] : undefined;
    const next = index + 1 < messages.length ? messages[index + 1] : undefined;

    const sameMinute = (a: string, b: string) =>
        Math.floor(new Date(a).getTime() / 60000) === Math.floor(new Date(b).getTime() / 60000);

    // one timestamp per minute: only the last message of that minute shows it
    const isShowTime = !next || !sameMinute(message.createdAt, next.createdAt);

    const isGroupBreak = !prev || message.senderId !== prev.senderId || new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() > 300000;

    const participant = selectedConvo.participants.find(
        (p: Participant) => p._id.toString() === message.senderId.toString()
    );


    return (
        <div className={cn("flex gap-2 message-bounce mt-1", isGroupBreak && "mt-3", message.isOwn ? "justify-end" : "justify-start")}>
            {!message.isOwn && (
                <div className="w-8">
                    {isGroupBreak && (
                        <UserProfilePicture type="chat" name={participant?.displayName ?? "UniConnect"} profilePictureUrl={participant?.profilePictureUrl ?? undefined} />
                    )}
                </div>
            )}

            <div className={cn("max-w-xs lg:max-w-md space-y-1 flex flex-col", message.isOwn ? "items-end" : "items-start")}>

                {isGroupBreak && !message.isOwn && selectedConvo.type === "group" && (
                    <span className="px-1 text-xs font-semibold text-muted-foreground">
                        {participant?.displayName}
                    </span>
                )}

                <Card className={cn(
                    "px-3.5 py-2 rounded-2xl ring-0 shadow-none",
                    message.isOwn
                        ? ["bg-[hsl(var(--chat-bubble-sent))] text-[hsl(var(--chat-bubble-sent-foreground))] shadow-bubble border-0", !isGroupBreak && "rounded-tr-md"]
                        : ["bg-chat-bubble-received", !isGroupBreak && "rounded-tl-md"]
                )}>
                    <p className="text-sm leading-relaxed break-words">
                        {message.content}
                    </p>
                </Card>

                {isShowTime && (
                    <span className="px-1 text-xs text-muted-foreground">
                        {formatMessageTime(new Date(message.createdAt))}
                    </span>
                )}

                {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
                    <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5 h-4 border-0", lastMessageStatus === "seen" ? "bg-primary/20 text-primary" : "text-muted-foreground")}>
                        {lastMessageStatus}
                    </Badge>
                )}
            </div >

        </div >
    );
};

export default MessageItem;
