import { apiClient } from '@/lib/apiClient';

export async function fetchUserProjects() {
	const { data } = await apiClient.get('/users/me/projects', {
		withCredentials: true,
	});
	return data;
}
