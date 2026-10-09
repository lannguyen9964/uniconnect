import { useState, type ReactNode } from "react"
import { BellIcon, UserRoundIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserProfilePicture from "./UserProfilePicture"
import { cn } from "@/lib/utils"
import type { User } from "@/types/user"

type Section = "account" | "notifications"

const SECTIONS = [
    { id: "account", label: "Account", icon: UserRoundIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
] as const

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex items-baseline justify-between gap-4 py-2">
        <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
        <span className="truncate text-sm font-medium">{value?.trim() ? value : "—"}</span>
    </div>
)

interface UserModalProps {
    user: User;
    /** what opens the modal, e.g. the profile row in the sidebar footer */
    children: ReactNode;
    className?: string;
}

const UserModal = ({ user, children, className }: UserModalProps) => {
    const [section, setSection] = useState<Section>("account")

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString([], { month: "long", year: "numeric" })
        : undefined

    return (
        <Dialog>
            <DialogTrigger aria-label="Open your profile" className={className}>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Your profile</DialogTitle>
                    <DialogDescription>Your account details and notifications.</DialogDescription>
                </DialogHeader>

                <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setSection(id)}
                            aria-pressed={section === id}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-smooth",
                                section === id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="size-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {section === "account" ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <UserProfilePicture
                                type="profile"
                                name={user.displayName}
                                profilePictureUrl={user.profilePictureUrl}
                            />
                            <div className="flex flex-col items-center">
                                <span className="text-base font-semibold">{user.displayName}</span>
                                <span className="text-sm text-muted-foreground">@{user.username}</span>
                            </div>
                        </div>

                        <div className="divide-y rounded-xl border px-4">
                            <InfoRow label="First name" value={user.firstName} />
                            <InfoRow label="Last name" value={user.lastName} />
                            <InfoRow label="Email" value={user.email} />
                            <InfoRow label="Phone number" value={user.phoneNumber} />
                            <InfoRow label="Bio" value={user.bio} />
                            <InfoRow label="Member since" value={memberSince} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 rounded-xl border py-10 text-center">
                        <BellIcon className="size-6 text-muted-foreground" />
                        <p className="text-sm font-medium">No notifications yet</p>
                        <p className="text-sm text-muted-foreground">
                            Friend requests and mentions will show up here.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
};

export default UserModal;
