import { apiClient } from '@lib/apiClient';
import type { User } from '@/features/users/types/user';

export const fetchMe = async (): Promise<User> => {
	const response = await apiClient.get(`/users/me`, {
		withCredentials: true,
	});
	return response.data;
};
