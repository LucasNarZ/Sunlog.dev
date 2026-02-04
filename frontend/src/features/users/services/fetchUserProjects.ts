import { apiClient } from '@/lib/apiClient';

export async function fetchUserProjects(userId: string) {
	const { data } = await apiClient.get(`/users/${userId}/projects`);
	return data;
}
