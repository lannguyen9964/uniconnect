import { cn } from "@/lib/utils";
import { formatOnlineTime } from "@/lib/utils"

interface ChatCardProps {
    convoId: string;
    name: string;
    isActive: boolean;
    onSelect: (id: string) => void;
    unreadCount?: number;
    timestamp?: Date;
    leftSection: React.ReactNode;
    subtitle: React.ReactNode;
}

const ChatCard = ({
    convoId,
    name,
    isActive,
    onSelect,
    unreadCount,
    timestamp,
    leftSection,
    subtitle
}: ChatCardProps) => {

    return (
        <button
            type="button"
            key={convoId}
            onClick={() => onSelect(convoId)}
            className={cn(
                "w-full rounded-xl px-3 py-2 text-left transition-smooth hover:bg-muted/40",
                isActive && "bg-primary/10"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">{leftSection}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className={cn("truncate text-sm font-medium", unreadCount && unreadCount > 0 && "font-bold text-foreground")}>
                            {name}
                        </h3>
                        <span className="shrink-0 text-xs text-muted-foreground">{timestamp ? formatOnlineTime(timestamp) : ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1">{subtitle}</div>
                    </div>
                </div>
            </div>
        </button>
    )

};

export default ChatCard;
