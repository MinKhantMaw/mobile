import type { ApiResponse, AuthResponse, User } from '../types';
import apiClient from './axios';

export const authApi = {
    // Customer auth
    login: (email: string, password: string) =>
        apiClient.post<ApiResponse<AuthResponse>>('/auth/customer/login', { email, password }),

    register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
        apiClient.post<ApiResponse<AuthResponse>>('/auth/customer/register', data),

    logout: () =>
        apiClient.post('/auth/customer/logout'),

    logoutAll: () =>
        apiClient.post('/auth/logout-all'),

    refreshToken: (refresh_token: string) =>
        apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refresh_token }),

    getProfile: () =>
        apiClient.get<ApiResponse<User>>('/auth/customer/profile'),

    updateProfile: (data: Partial<User>) =>
        apiClient.put<ApiResponse<User>>('/auth/customer/profile', data),

    // Admin auth
    adminLogin: (email: string, password: string) =>
        apiClient.post<ApiResponse<AuthResponse>>('/auth/admin/login', { email, password }),

    // Change password
    changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
        apiClient.post('/auth/change-password', data),
};
