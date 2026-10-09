import api from "@/lib/axios";

export const friendService = {
    async findByUsername(username: string) {
        const response = await api.get(`/user/search?username=${username}`);
        return response.data.user;
    },

    async sendFriendRequest(to: string, message?: string) {
        const response = await api.post("/friends/requests", { to, message });
        return response.data.message;
    },

    async getAllFriendRequests() {
        try {
            const response = await api.get("/friends/requests");
            const { sent, received } = response.data;
            return { sent, received };
        } catch (error) {
            console.error("Error fetching friend requests", error);
        }
    },

    async acceptFriendRequest(requestId: string) {
        try {
            const response = await api.post(`/friends/requests/${requestId}/accept`);
            return response.data.requestAcceptedBy;
        } catch (error) {
            console.error("Error accepting friend request", error);
        }
    },

    async declineFriendRequest(requestId: string) {
        try {
            await api.post(`/friends/requests/${requestId}/decline`);
        } catch (error) {
            console.error("Error declining friend request", error);
        }
    }
}