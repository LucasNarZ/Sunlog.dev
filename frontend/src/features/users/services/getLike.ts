import { apiClient } from '@/lib/apiClient';

export async function getLike(likedId: string) {
	try {
		const { data } = await apiClient.get(`/post/like/${likedId}`);
		return data;
	} catch {
		return null;
	}
}
