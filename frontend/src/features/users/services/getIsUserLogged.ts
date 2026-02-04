import { apiClient } from '../../../lib/apiClient';

export async function getIsUserLoggedUser() {
	const { data } = await apiClient.get('/users/me/id', {
		withCredentials: true,
	});
	return data;
}
