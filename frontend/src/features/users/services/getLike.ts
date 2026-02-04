import { apiClient } from '@/lib/apiClient';

export async function getLike(likedId: string) {
	const { data } = await apiClient.get(`/post/like/${likedId}`);
	return data;
}
