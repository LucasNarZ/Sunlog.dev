import { useEffect, useState } from 'react';
import type { User } from '@/features/users/types/user';
import { fetchUserProfile } from '@/features/users/services/fetchUserProfile';

const useUserProfile = (): [User | null, unknown, boolean] => {
	const [error, setError] = useState<unknown>(null);
	const [response, setResponse] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const data = await fetchUserProfile();
				setResponse(data);
			} catch (err) {
				console.log(err);
				setError(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return [response, error, loading];
};

export default useUserProfile;
