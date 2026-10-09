import api from "@/lib/axios";

export const authService = {
    register: async (username: string, password: string, email: string, firstName: string, lastName: string) => {
        const response = await api.post("/auth/register", { username, password, email, firstName, lastName }, { withCredentials: true });
        return response.data;
    },
    login: async (username: string, password: string) => {
        const response = await api.post("/auth/login", { username, password }, { withCredentials: true });
        return response.data;
    },
    logout: async () => {
        return api.post("/auth/logout", {}, { withCredentials: true });
    },

    fetchMe: async () => {
        const response = await api.get("/user/me", { withCredentials: true });
        return response.data.user;
    },

    refreshToken: async () => {
        const response = await api.post("/auth/refresh", { withCredentials: true });
        return response.data.accessToken;
    }
};