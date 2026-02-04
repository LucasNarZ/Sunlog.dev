import { apiClient } from '@/lib/apiClient';

export async function fetchProject(slug: string) {
	const { data } = await apiClient.get(`/projects/${slug}`);
	return data;
}
