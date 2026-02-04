import { apiClient } from '@/lib/apiClient';

export async function fetchProjectDevlogs(projectId: string) {
	const { data } = await apiClient.get(
		`/projects/${projectId}/devlog-events`,
	);
	return data;
}
