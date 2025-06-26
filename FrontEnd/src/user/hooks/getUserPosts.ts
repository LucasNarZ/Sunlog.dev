import { useEffect, useState } from 'react';
import { Post } from '../../post/types/post';
import { apiClient } from '../../lib/apiClient';

const usePostsByAuthor = (
	userId: string | undefined,
): [Post[] | null, unknown | null] => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [error, setError] = useState<unknown | null>(null);

	useEffect(() => {
		(async () => {
			if (!userId) return;
			try {
				const response = await apiClient.get(
					'/user/' + userId + '/posts',
				);
				setPosts(response.data);
			} catch (err) {
				setError(err);
			}
		})();
	}, [userId]);

	return [posts, error];
};

export default usePostsByAuthor;
