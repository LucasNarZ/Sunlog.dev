import { apiClient } from '@lib/apiClient';
import type { User } from '@/features/users/types/user';

export const fetchUserProfile = async (slug: string): Promise<User> => {
	const response = await apiClient.get(`/users/${slug}`, {
		withCredentials: true,
	});
	return response.data;
};
