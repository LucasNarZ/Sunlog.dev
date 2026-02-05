import axios from 'axios';

const isServer = typeof window === 'undefined';

let isRefreshing = false;
let queue: Array<{
	resolve: (value: any) => void;
	reject: (reason?: any) => void;
}> = [];

export const apiClient = axios.create({
	baseURL:
		process.env.NODE_ENV == 'development'
			? isServer
				? 'http://nginx/api'
				: 'http://localhost/api'
			: isServer
				? process.env.INTERNAL_API_URL
				: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.response.use(
	(res) => res,
	async (error) => {
		const status = error.response?.status;
		const original = error.config;

		if (!original || !original.url) {
			return Promise.reject(error);
		}

		if (original.url.includes('/auth/refresh')) {
			return Promise.reject(error);
		}

		if (status === 401 && !original._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					queue.push({ resolve, reject });
				});
			}

			original._retry = true;
			isRefreshing = true;

			try {
				await apiClient.post('/auth/refresh');

				queue.forEach((p) => p.resolve(apiClient(original)));
				queue = [];
				isRefreshing = false;

				return apiClient(original);
			} catch (err) {
				queue.forEach((p) => p.reject(err));
				queue = [];
				isRefreshing = false;

				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);
