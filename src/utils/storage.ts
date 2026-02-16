import { Platform } from 'react-native';

/**
 * Cross-platform secure storage.
 * Uses expo-secure-store on native, localStorage on web.
 */

let SecureStore: {
    getItemAsync: (key: string) => Promise<string | null>;
    setItemAsync: (key: string, value: string) => Promise<void>;
    deleteItemAsync: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
    SecureStore = {
        getItemAsync: async (key) => localStorage.getItem(key),
        setItemAsync: async (key, value) => localStorage.setItem(key, value),
        deleteItemAsync: async (key) => localStorage.removeItem(key),
    };
} else {
    // Dynamic import so it doesn't crash on web
    const ExpoSecureStore = require('expo-secure-store');
    SecureStore = {
        getItemAsync: ExpoSecureStore.getItemAsync,
        setItemAsync: ExpoSecureStore.setItemAsync,
        deleteItemAsync: ExpoSecureStore.deleteItemAsync,
    };
}

export default SecureStore;
