import { apiClient } from '@/lib/apiClient';

export async function fetchFollow(followerdId: string) {
	const { data } = await apiClient.get(`/follow/${followerdId}`);
	return data;
}
