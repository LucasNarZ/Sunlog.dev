import { apiClient } from '@/lib/apiClient';

export async function fetchProjectDevlogs(projectId: string) {
	try {
		const { data } = await apiClient.get(
			`/projects/${projectId}/devlog-events`,
		);
		return data;
	} catch {
		return null;
	}
}
