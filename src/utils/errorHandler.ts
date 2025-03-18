import axios from 'axios';
import { ref } from 'vue';

export const apiError = ref<string | null>(null);

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.response.use(
    (response) => response, // Pass successful responses
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const requestId = error.response.headers['x-request-id'] ?? 'Unknown';
            const errMessage = error.response.data.message || 'An error occurred';
            apiError.value = `Error ${status}: ${errMessage} (Request ID: ${requestId})}`

            // clear error after 5 seconds
            setTimeout(() => {
                apiError.value = null;
            }, 5000);
        } else {
            apiError.value = 'Network error';
        }
        return Promise.reject(error);
    }
);

export default api;
