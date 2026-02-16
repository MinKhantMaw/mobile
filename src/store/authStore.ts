import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { User } from '../types';
import SecureStore from '../utils/storage';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    adminLogin: (email: string, password: string) => Promise<void>;
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
    logout: () => Promise<void>;
    loadToken: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true, // starts as true to check stored token
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await authApi.login(email, password);
            const { user, access_token, refresh_token } = res.data.data;

            await SecureStore.setItemAsync('access_token', access_token);
            await SecureStore.setItemAsync('refresh_token', refresh_token);

            const isAdmin = user.roles?.some((r) => r.name === 'admin' || r.name === 'super-admin') ?? false;

            set({ user, token: access_token, isAuthenticated: true, isAdmin, isLoading: false });
        } catch (error: any) {
            const message = error.response?.status === 422
                ? (Object.values(error.response.data.errors as Record<string, string[]>).flat()[0])
                : error.response?.data?.message || 'Login failed. Check your credentials.';
            set({ error: message, isLoading: false });
        }
    },

    adminLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await authApi.adminLogin(email, password);
            const { user, access_token, refresh_token } = res.data.data;

            await SecureStore.setItemAsync('access_token', access_token);
            await SecureStore.setItemAsync('refresh_token', refresh_token);

            set({ user, token: access_token, isAuthenticated: true, isAdmin: true, isLoading: false });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Admin login failed.';
            set({ error: message, isLoading: false });
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await authApi.register(data);
            const { user, access_token, refresh_token } = res.data.data;

            await SecureStore.setItemAsync('access_token', access_token);
            await SecureStore.setItemAsync('refresh_token', refresh_token);

            set({ user, token: access_token, isAuthenticated: true, isAdmin: false, isLoading: false });
        } catch (error: any) {
            const message = error.response?.status === 422
                ? (Object.values(error.response.data.errors as Record<string, string[]>).flat()[0])
                : error.response?.data?.message || 'Registration failed.';
            set({ error: message, isLoading: false });
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch {
            // Clear local state even if API fails
        }
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false, isLoading: false, error: null });
    },

    loadToken: async () => {
        try {
            const token = await SecureStore.getItemAsync('access_token');
            if (token) {
                const res = await authApi.getProfile();
                const user = res.data.data;
                const isAdmin = user.roles?.some((r) => r.name === 'admin' || r.name === 'super-admin') ?? false;
                set({ user, token, isAuthenticated: true, isAdmin, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch {
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
