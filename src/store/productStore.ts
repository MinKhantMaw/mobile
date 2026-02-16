import { create } from 'zustand';
import { productsApi } from '../api/products';
import type { Category, Product } from '../types';

interface ProductState {
    products: Product[];
    categories: Category[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    currentPage: number;
    lastPage: number;
    hasMore: boolean;

    fetchProducts: (page?: number, search?: string, categoryId?: number) => Promise<void>;
    refreshProducts: (search?: string, categoryId?: number) => Promise<void>;
    loadMore: (search?: string, categoryId?: number) => Promise<void>;
    fetchCategories: () => Promise<void>;
    reset: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    categories: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    currentPage: 1,
    lastPage: 1,
    hasMore: true,

    fetchProducts: async (page = 1, search, categoryId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productsApi.getAll(page, search, categoryId);
            // API shape: { message, data: [...], meta: { pagination: { current_page, last_page, ... } } }
            const products = res.data.data;
            const pagination = res.data.meta?.pagination;
            const currentPage = pagination?.current_page ?? 1;
            const lastPage = pagination?.last_page ?? 1;
            set({
                products: page === 1 ? products : [...get().products, ...products],
                currentPage,
                lastPage,
                hasMore: currentPage < lastPage,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to load products', isLoading: false });
        }
    },

    refreshProducts: async (search, categoryId) => {
        set({ isRefreshing: true });
        try {
            const res = await productsApi.getAll(1, search, categoryId);
            const products = res.data.data;
            const pagination = res.data.meta?.pagination;
            set({
                products,
                currentPage: 1,
                lastPage: pagination?.last_page ?? 1,
                hasMore: 1 < (pagination?.last_page ?? 1),
                isRefreshing: false,
            });
        } catch {
            set({ isRefreshing: false });
        }
    },

    loadMore: async (search, categoryId) => {
        const { hasMore, isLoading, currentPage } = get();
        if (!hasMore || isLoading) return;
        await get().fetchProducts(currentPage + 1, search, categoryId);
    },

    fetchCategories: async () => {
        try {
            const res = await productsApi.getCategories();
            set({ categories: res.data.data });
        } catch {
            // Silent fail for categories
        }
    },

    reset: () => set({ products: [], currentPage: 1, lastPage: 1, hasMore: true }),
}));
