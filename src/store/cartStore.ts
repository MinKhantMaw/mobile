import { create } from 'zustand';
import { cartApi } from '../api/cart';
import type { Cart } from '../types';

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;

    fetchCart: () => Promise<void>;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    updateItem: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    mergeCart: () => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: null,
    isLoading: false,
    error: null,

    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await cartApi.get();
            set({ cart: res.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to load cart', isLoading: false });
        }
    },

    addItem: async (productId, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
            const res = await cartApi.addItem(productId, quantity);
            set({ cart: res.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to add item', isLoading: false });
        }
    },

    updateItem: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
            const res = await cartApi.updateItem(itemId, quantity);
            set({ cart: res.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update item', isLoading: false });
        }
    },

    removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await cartApi.removeItem(itemId);
            set({ cart: res.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to remove item', isLoading: false });
        }
    },

    mergeCart: async () => {
        try {
            const res = await cartApi.merge();
            set({ cart: res.data.data });
        } catch {
            // Silent fail for merge
        }
    },

    clearCart: () => set({ cart: null }),
}));
