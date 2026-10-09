import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";


export const useFriendStore = create<FriendState>()((set, get) => ({
    loading: false,
    receivedFriendRequests: [],
    sentFriendRequests: [],
    findByUsername: async (username) => {
        try {
            set({ loading: true });
            const user = await friendService.findByUsername(username);
            return user;
        } catch (error) {
            console.error("Error finding user by username", error);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    addFriend: async (to, message) => {
        try {
            set({ loading: true });
            const result = await friendService.sendFriendRequest(to, message);
            return result;
        } catch (error) {
            console.error("Error sending friend request", error);
            throw error; // the caller toasts the failure
        } finally {
            set({ loading: false });
        }
    },

    getAllFriendRequests: async () => {
        try {
            set({ loading: true });
            const result = await friendService.getAllFriendRequests();
            if (!result) {
                return;
            }

            const { sent, received } = result;
            set({ sentFriendRequests: sent, receivedFriendRequests: received });
        } catch (error) {
            console.error("Error fetching friend requests", error);
        } finally {
            set({ loading: false });
        }
    },

    acceptFriendRequest: async (requestId) => {
        try {
            set({ loading: true });
            await friendService.acceptFriendRequest(requestId);
            set((state) => ({
                receivedFriendRequests: state.receivedFriendRequests.filter((r) => r._id !== requestId)
            }));
        } catch (error) {
            console.error("Error accepting friend request", error);
        } finally {
            set({ loading: false });
        }
    },

    declineFriendRequest: async (requestId) => {
        try {
            set({ loading: true });
            await friendService.declineFriendRequest(requestId);
            set((state) => ({
                receivedFriendRequests: state.receivedFriendRequests.filter((r) => r._id !== requestId)
            }));
        } catch (error) {
            console.error("Error declining friend request", error);
        } finally {
            set({ loading: false });
        }
    }
}));