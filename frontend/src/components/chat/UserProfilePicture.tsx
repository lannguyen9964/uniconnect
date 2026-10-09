import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface UserProfilePicProps {
    type: "sidebar" | "profile" | "chat"
    name: string;
    profilePictureUrl?: string | null;
    className?: string;
}

const sizeByType: Record<UserProfilePicProps["type"], string> = {
    sidebar: "size-12",
    chat: "size-8",
    profile: "size-24",
};

const textByType: Record<UserProfilePicProps["type"], string> = {
    sidebar: "text-base",
    chat: "text-sm",
    profile: "text-3xl shadow-md",
};

/** "Lan Nguyen" -> "LN", "madonna" -> "M", "" -> "?" */
const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "?";
    return words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};

const UserProfilePicture = ({ type, name, profilePictureUrl, className }: UserProfilePicProps) => {

    return (
        <Avatar className={cn(sizeByType[type], className)}>
            {profilePictureUrl ? (
                <AvatarImage src={profilePictureUrl} alt={name} />
            ) : null}
            {/* no picture: fall back to the person's initials on the brand gradient */}
            <AvatarFallback
                aria-label={name}
                className={cn(
                    "bg-gradient-primary font-semibold text-white",
                    textByType[type]
                )}
            >
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    )
};

export default UserProfilePicture;
