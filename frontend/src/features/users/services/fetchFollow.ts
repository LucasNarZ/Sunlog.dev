import { apiClient } from '@/lib/apiClient';

export async function fetchFollow(followerdId: string) {
	try {
		const { data } = await apiClient.get(`/follow/${followerdId}`);
		return data;
	} catch {
		return null;
	}
}
