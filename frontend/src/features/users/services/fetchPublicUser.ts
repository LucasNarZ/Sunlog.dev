import { apiClient } from '../../../lib/apiClient';

export async function fetchPublicUser(userId: string) {
	const { data } = await apiClient.get(`users/` + userId);
	return data;
}
