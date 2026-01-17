import { apiClient } from '@/lib/apiClient';

export async function fetchProject(slug: string) {
	try {
		const { data } = await apiClient.get(`/projects/${slug}`);
		return data;
	} catch {
		return null;
	}
}
