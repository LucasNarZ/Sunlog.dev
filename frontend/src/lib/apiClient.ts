import axios from 'axios';

const isServer = typeof window === 'undefined';

let isRefreshing = false;
let queue: Array<() => void> = [];

export const apiClient = axios.create({
	baseURL:
		process.env.NODE_ENV == 'development'
			? isServer
				? 'http://nginx/api'
				: 'http://localhost/api'
			: 'https://sunlog.dev/api',
});

apiClient.interceptors.response.use(
	(res) => res,
	async (error) => {
		const status = error.response?.status;
		const original = error.config;

		if (original.url.includes('/auth/refresh')) {
			return Promise.reject(error);
		}

		if (status === 401 && !original._retry) {
			if (isRefreshing) {
				return new Promise((resolve) => {
					queue.push(() => resolve(apiClient(original)));
				});
			}
			original._retry = true;
			isRefreshing = true;

			try {
				await apiClient.post('/auth/refresh');
				queue.forEach((cb) => cb());
				queue = [];
				isRefreshing = false;
				return apiClient(original);
			} catch (err) {
				isRefreshing = false;
				queue = [];
				throw error;
			}
		}
		throw error;
	},
);
