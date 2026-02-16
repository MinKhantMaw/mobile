import type { ApiResponse, Order, PaginatedResponse } from '../types';
import apiClient from './axios';

export const ordersApi = {
    getAll: (page = 1) =>
        apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params: { page } }),

    getById: (orderId: string) =>
        apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`),

    create: (data?: any) =>
        apiClient.post<ApiResponse<Order>>('/checkout', data),
};
