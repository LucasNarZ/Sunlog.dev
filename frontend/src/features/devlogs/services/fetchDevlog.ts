import { apiClient } from '../../../lib/apiClient';

export async function fetchDevlog(slug: string) {
	const { data } = await apiClient.get(`/devlogEvents/slug/${slug}`);
	return data;
}
