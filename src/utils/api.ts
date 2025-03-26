/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { ref } from 'vue';
import createAuthRefreshInterceptor, { type AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import useUserStateStore from '../stores/userStateStore';
import env from './env';

const api = axios.create({
	baseURL: import.meta.env.MODE === 'production' ? env.get('VITE_BACKEND_BASE') + '/api' : '/api',
});
export const apiError = ref<string | null>(null);
const refreshAccessToken = async (failedRequest: any) => {
	const store = useUserStateStore();
    try {
        const response = await axios.post(
            '/api/token', {}, {
                withCredentials: true, skipAuthRefresh: true
            } as AxiosAuthRefreshRequestConfig
        );
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
		
		store.updateAuthStatus(true);
        failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`;
		store.updateLoadingStatus(false);
        return Promise.resolve(failedRequest);
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
			store.updateAuthStatus(false);
            error.response.data.message = 'User logged-out';
        }
        return Promise.reject(error);
    }
};

// Request interceptors
// Add the access-token to the Authorization header
api.interceptors.request.use(
    (config) => {
		
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
		const store = useUserStateStore();
		store.updateLoadingStatus(true);
        return config;
    }
);

// cancel loading status when getting response
api.interceptors.response.use(
	(response) => {
		const store = useUserStateStore();
		store.updateLoadingStatus(false);
		return Promise.resolve(response);
	}
);

// Response interceptors
createAuthRefreshInterceptor(api, refreshAccessToken);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const status = error.response.status;
            const requestId = error.response.headers['x-request-id'] ?? 'Unknown';
            const errMessage = error.response.data.message || 'An error occurred';
            apiError.value = `Error ${status}: ${errMessage} (Request ID: ${requestId})}`;
        } else {
            apiError.value = 'Network error';
        }
		const store = useUserStateStore();
		store.updateLoadingStatus(false);
        return Promise.reject(error);
    }
);


export default api;
