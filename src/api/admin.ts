import type { AnalyticsOverview, ApiResponse, Order, PaginatedResponse, Product, Role, User } from '../types';
import apiClient from './axios';

export const adminApi = {
    // Analytics
    getOverview: () =>
        apiClient.get<ApiResponse<AnalyticsOverview>>('/admin/analytics/overview'),

    // Products CRUD
    getProducts: (page = 1) =>
        apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/admin/products', { params: { page } }),

    createProduct: (data: FormData) =>
        apiClient.post<ApiResponse<Product>>('/admin/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    updateProduct: (id: number, data: any) =>
        apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, data),

    deleteProduct: (id: number) =>
        apiClient.delete(`/admin/products/${id}`),

    uploadProductImage: (productId: number, data: FormData) =>
        apiClient.post(`/admin/products/${productId}/images`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    // Orders
    getOrders: (page = 1) =>
        apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/admin/orders', { params: { page } }),

    getOrder: (orderId: string) =>
        apiClient.get<ApiResponse<Order>>(`/admin/orders/${orderId}`),

    updateOrderStatus: (orderId: string, status: string) =>
        apiClient.patch(`/admin/orders/${orderId}/status`, { status }),

    // Users
    getUsers: (page = 1) =>
        apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params: { page } }),

    createUser: (data: any) =>
        apiClient.post<ApiResponse<User>>('/users', data),

    updateUser: (id: number, data: any) =>
        apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

    deleteUser: (id: number) =>
        apiClient.delete(`/users/${id}`),

    // Roles
    getRoles: () =>
        apiClient.get<ApiResponse<Role[]>>('/roles'),

    createRole: (data: any) =>
        apiClient.post<ApiResponse<Role>>('/roles', data),

    updateRole: (id: number, data: any) =>
        apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data),

    deleteRole: (id: number) =>
        apiClient.delete(`/roles/${id}`),

    syncPermissions: (roleId: number, permissions: number[]) =>
        apiClient.put(`/roles/${roleId}/permissions`, { permissions }),
};
