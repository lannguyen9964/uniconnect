import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Add a request interceptor to include the access token in the headers
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    }
    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    const ogRequest = error.config;

    if (ogRequest.url.includes("/auth/login") || ogRequest.url.includes("/auth/register") || ogRequest.url.includes("/auth/refresh")) {
        return Promise.reject(error);
    }


    ogRequest.retryCount = ogRequest.retryCount || 0;

    if (error.response?.status === 403 && ogRequest.retryCount < 3) {
        ogRequest.retryCount += 1;
        console.log("Refresh", ogRequest.retryCount);
        try {
            const response = await api.post("/auth/refresh", { withCredentials: true });
            const newAccessToken = response.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccessToken);
            ogRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(ogRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearSession();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default api;