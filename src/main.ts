import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';

import { api } from './globalVar';
import App from './App.vue';
import router from './router';
import './style/style.css';

// Axios interceptor to add the token to the Authorization header
api.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken');
		if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	}
);

createApp(App).use(router).mount('#app');
