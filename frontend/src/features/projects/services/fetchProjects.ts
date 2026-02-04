import { apiClient } from '@/lib/apiClient';
import { Project } from '@/features/projects/types/project';

export async function fetchProjects(): Promise<Project[]> {
	const { data } = await apiClient.get(`/projects`);
	return data;
}
