import type { ApiResponse, Cart } from '../types';
import apiClient from './axios';

export const cartApi = {
    get: () =>
        apiClient.get<ApiResponse<Cart>>('/cart'),

    addItem: (product_id: number, quantity = 1) =>
        apiClient.post<ApiResponse<Cart>>('/cart/items', { product_id, quantity }),

    updateItem: (itemId: number, quantity: number) =>
        apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity }),

    removeItem: (itemId: number) =>
        apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`),

    merge: (guest_cart_id?: string) =>
        apiClient.post<ApiResponse<Cart>>('/cart/merge', { guest_cart_id }),
};
