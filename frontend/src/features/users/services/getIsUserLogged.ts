import { apiClient } from '../../../lib/apiClient';

export async function getIsUserLoggedUser() {
	try {
		const { data } = await apiClient.get('/users/me/id', {
			withCredentials: true,
		});
		return data;
	} catch (err) {
		console.log(err);
		return null;
	}
}
