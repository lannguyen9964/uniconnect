import { toast } from "sonner";
import { create } from "zustand";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";


export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        loading: false,
        user: null,

        clearSession: () => {
            set({ accessToken: null, user: null, loading: false });
            useChatStore.getState().reset();
            localStorage.clear();
            sessionStorage.clear();
        },

        signUp: async (username, password, email, firstName, lastName) => {
            try {
                get().clearSession();
                set({ loading: true })

                //call API
                await authService.register(username, password, email, firstName, lastName);

                toast.success("Account registered successfully");


            } catch (error) {
                console.error(error);
                toast.error("Unable to register account");
            } finally {
                set({ loading: false })
            }
        },

        signIn: async (username, password) => {
            try {
                set({ loading: true });

                localStorage.clear();
                useChatStore.getState().reset();

                //call API
                const { accessToken } = await authService.login(username, password);
                get().setAccessToken(accessToken);

                await get().fetchMe();
                useChatStore.getState().fetchConversations();

                toast.success("Logged in successfully");
                return true;

            } catch (error) {
                console.error(error);
                toast.error("Unable to login");
                return false;
            } finally {
                set({ loading: false })
            }
        },

        signOut: async () => {
            try {
                get().clearSession();
                await authService.logout();
                toast.success("Logged out successfully");
            } catch (error) {
                console.error(error);
                toast.error("Unable to logout");
            }
        },

        fetchMe: async () => {
            try {
                set({ loading: true });
                const user = await authService.fetchMe();
                set({ user });
            } catch (error) {
                console.error(error);
                set({ user: null, accessToken: null });
                toast.error("Unable to fetch user data");
            } finally {
                set({ loading: false });
            }
        },

        refresh: async () => {
            try {
                set({ loading: true });
                const { user, fetchMe, setAccessToken } = get();
                const accessToken = await authService.refreshToken();
                setAccessToken(accessToken);

                if (!user) {
                    await fetchMe();
                }
            } catch (error) {
                console.error(error);
                get().clearSession();
                toast.error("Session expired. Please log in again.");
            } finally {
                set({ loading: false });
            }
        },

        setAccessToken: (accessToken) => set({ accessToken }),

    }), {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }) // only persist (user)
    })
);