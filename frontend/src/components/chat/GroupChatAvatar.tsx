import type { Participant } from "@/types/chat";
import { cn } from "@/lib/utils";
import UserProfilePicture from "./UserProfilePicture";

interface GroupChatAvatarProps {
    type: "chat" | "sidebar";
    participants: Participant[];
}

const boxByType: Record<GroupChatAvatarProps["type"], string> = {
    chat: "size-8",
    sidebar: "size-12",
};

const avatarByType: Record<GroupChatAvatarProps["type"], string> = {
    chat: "size-5",
    sidebar: "size-8",
};

const GroupChatAvatar = ({ type, participants }: GroupChatAvatarProps) => {
    const members = participants.slice(0, 2);

    return (
        <div className={cn("relative shrink-0", boxByType[type])}>
            {members.map((member, i) => (
                <UserProfilePicture
                    key={member._id ?? i}
                    type={type}
                    name={member.displayName}
                    profilePictureUrl={member.profilePictureUrl ?? undefined}
                    className={cn(
                        avatarByType[type],
                        "absolute",
                        i === 0 ? "top-0 left-0" : "right-0 bottom-0 ring-2 ring-card"
                    )}
                />
            ))}
        </div>
    )

};

export default GroupChatAvatar;
