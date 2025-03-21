import axios from 'axios';
import { ref } from 'vue';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const api = axios.create({ baseURL: '/api' });
export const apiError = ref<string | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshAccessToken = async (failedRequest: any) => {
	const response = await api.post('/token', {}, { withCredentials: true });
	if (response.status === 401) {
		localStorage.removeItem('accessToken');
		window.location.href = '/';
		return Promise.reject(failedRequest);
	}
	const { accessToken } = response.data;
	localStorage.setItem('accessToken', accessToken);
	failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`;
	return Promise.resolve();
};

// Request interceptors
// Add the access-token to the Authorization header
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
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
		return Promise.reject(error);
	}
);


export default api;
