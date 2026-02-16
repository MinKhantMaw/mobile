import type { ApiResponse, Category, PaginatedApiResponse, Product } from '../types';
import apiClient from './axios';

export const productsApi = {
    getAll: (page = 1, search?: string, category?: number) => {
        const params: any = { page };
        if (search) params.search = search;
        if (category) params.category_id = category;
        return apiClient.get<PaginatedApiResponse<Product>>('/products', { params });
    },

    getBySlug: (slug: string) =>
        apiClient.get<ApiResponse<Product>>(`/products/${slug}`),

    getCategories: () =>
        apiClient.get<ApiResponse<Category[]>>('/categories'),
};
