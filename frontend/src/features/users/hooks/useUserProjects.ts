import { useEffect, useState } from 'react';
import { fetchUserProjects } from '../services/fetchUserProjects';
import { Project } from '@/features/projects/types/project';

const useUserProjects = (): [Project[] | null, unknown, boolean] => {
	const [error, setError] = useState<unknown>(null);
	const [response, setResponse] = useState<Project[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		(async () => {
			try {
				const data = await fetchUserProjects();
				setResponse(data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return [response, error, loading];
};

export default useUserProjects;
