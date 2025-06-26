import { useEffect, useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import type { Post } from '../types/post';

export const usePostsByTag = (tags: string[], categorys: string[]) => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		const fetch = async () => {
			try {
				const params = new URLSearchParams();
				tags.forEach(tag => params.append('tag', tag));
				categorys.forEach(cat => params.append('category', cat));
				const { data } = await apiClient.get(`/post?${params}`);
				setPosts(data);
				setError(null);
			} catch (err) {
				setError(err);
			}
		};
		fetch();
	}, [tags, categorys]);

	return [posts, error] as const;
};
