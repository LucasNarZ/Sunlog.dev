import { apiClient } from '@/lib/apiClient';
import type { Devlog } from '@/features/devlogs/types/devlog';

export const getTrendingDevlogs = async (): Promise<Devlog[]> => {
	const res = await apiClient.get('/devlogEvents/trending');
	return res.data;
};
