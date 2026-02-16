import axios from 'axios';
import SecureStore from '../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.27.138.99:8000/api/v1';

console.log('[API Config] Base URL:', API_URL);

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor: attach token + log
apiClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
});

// Response interceptor: auto-refresh + error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.code === 'ERR_NETWORK') {
            console.error('[Network Error] Cannot reach server. Is Laravel running with --host 0.0.0.0?');
            return Promise.reject(error);
        }

        // Auto-refresh token on 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await SecureStore.getItemAsync('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');

                const res = await axios.post(`${API_URL}/auth/refresh`, {
                    refresh_token: refreshToken,
                });

                const { access_token } = res.data.data;
                await SecureStore.setItemAsync('access_token', access_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                await SecureStore.deleteItemAsync('access_token');
                await SecureStore.deleteItemAsync('refresh_token');
                return Promise.reject(refreshError);
            }
        }

        console.error(`[API Error] ${error.response?.status}`, error.response?.data?.message);
        return Promise.reject(error);
    }
);

export default apiClient;
