import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { apiClient } from '../apiClient';

const useLike = (
	likedId: string | undefined,
): [boolean | null, Dispatch<SetStateAction<boolean | null>>, unknown] => {
	const [error, setError] = useState<unknown>(null);
	const [response, setResponse] = useState<boolean | null>(null);
	useEffect(() => {
		(async () => {
			if (!likedId) return;
			try {
				const response = await apiClient.get(`/post/like/${likedId}`);
				setResponse(response.data);
			} catch (err) {
				setError(err);
			}
		})();
	}, [likedId]);

	return [response, setResponse, error];
};

export default useLike;
