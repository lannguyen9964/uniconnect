import { useNavigate } from "react-router"
import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import UserProfilePicture from "@/components/chat/UserProfilePicture"
import UserModal from "@/components/chat/UserModal"
import type { User } from "@/types/user"

export function NavUser({ user }: { user: User }) {

  const { signOut } = useAuthStore()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 rounded-2xl border bg-background p-2 pl-2.5">
          <UserModal
            user={user}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left transition-smooth hover:bg-muted/50"
          >
            <UserProfilePicture
              type="chat"
              name={user.displayName}
              profilePictureUrl={user.profilePictureUrl}
              className="size-10"
            />
            <div className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-sm font-semibold">{user.displayName}</span>
              <span className="truncate text-xs text-muted-foreground">@{user.username}</span>
            </div>
          </UserModal>

          <Button variant="ghost" size="icon-lg" aria-label="Log out" onClick={handleLogout} className="rounded-xl">
            <LogOutIcon />
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
