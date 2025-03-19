import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [vue()],
		server: {
			proxy: mode === 'production' ? undefined : {
				'/api': {
					target: env.VITE_BACKEND_BASE,
					changeOrigin: true,
					secure: false
				}
			}
		}
	};
});
