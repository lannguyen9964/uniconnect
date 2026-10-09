import * as React from "react"

import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import CreateNewChat from "../chat/CreateNewChat"
import NewGroupChatModal from "../chat/NewGroupChatModal"
import AddFriendModal from "../chat/AddFriendModal"
import GroupMessageCard from "../chat/GroupMessageCard"
import PrivateMessageCard from "../chat/PrivateMessageCard"
import { useThemeStore } from "@/stores/useThemeStore"
import { useChatStore } from "@/stores/useChatStore"
import { useAuthStore } from "@/stores/useAuthStore"
import type { Conversation } from "@/types/chat"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { conversations, activeConversationId } = useChatStore();

  const byNewest = (a: Conversation, b: Conversation) =>
    new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime();

  // unread first, each group newest first: the open chat counts as read
  const unread = conversations
    .filter((c) => c._id !== activeConversationId && (user ? c.unreadCounts?.[user._id] ?? 0 : 0) > 0)
    .sort(byNewest);

  const earlier = conversations
    .filter((c) => !unread.includes(c))
    .sort(byNewest);

  const renderCard = (convo: Conversation) =>
    convo.type === "group"
      ? <GroupMessageCard key={convo._id} convo={convo} />
      : <PrivateMessageCard key={convo._id} convo={convo} />;

  return (
    <Sidebar variant="inset" {...props}>

      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* plain div: the Switch is a button and can't sit inside SidebarMenuButton */}
            <div className="flex h-12 w-full items-center justify-between rounded-xl bg-gradient-primary px-4">
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="size-8 shrink-0 object-contain" />
                <h1 className="text-xl font-bold text-white">UniConnect</h1>
              </a>
              <div className="flex items-center gap-2">
                <Sun className="size-4 text-white/80" />
                <Switch
                  aria-label="Dark mode"
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  className="data-checked:border-transparent data-checked:bg-background/40 data-unchecked:bg-white/30"
                />
                <Moon className="size-4 text-white/80" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="prettier-scrollbar">

        {/* Messages header: the three ways to start something */}
        <SidebarGroup className="pb-0">
          <SidebarGroupContent className="flex items-center justify-between px-1">
            <span className="text-sm font-bold">Messages</span>
            <div className="flex items-center gap-1">
              <NewGroupChatModal />
              <AddFriendModal />
              <CreateNewChat />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {conversations.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">No chats yet</p>
        )}

        {unread.length > 0 && (
          <SidebarGroup className="gap-1 py-1">
            <SidebarGroupContent className="px-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Unread · {unread.length}
            </SidebarGroupContent>
            <SidebarGroupContent className="-mx-2 divide-y divide-border/60">
              {unread.map(renderCard)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {earlier.length > 0 && (
          <SidebarGroup className="gap-1 py-1">
            {unread.length > 0 && (
              <SidebarGroupContent className="px-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Earlier
              </SidebarGroupContent>
            )}
            <SidebarGroupContent className="-mx-2 divide-y divide-border/60">
              {earlier.map(renderCard)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
