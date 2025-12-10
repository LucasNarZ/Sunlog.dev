import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { fetchUserProjects } from "../services/fetchUserProjects";
import { Project } from "@/features/projects/types/project";

const useUserProjects = (
  userId: string | undefined,
): [Project[] | null, unknown, boolean] => {
  const [error, setError] = useState<unknown>(null);
  const [response, setResponse] = useState<Project[] | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true)
  useEffect(() => {
    (async () => {
      if (!userId) return;
      try {
        const data = await fetchUserProjects(userId);
        setResponse(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false)
      }
    })();
  }, [userId]);

  return [response, error, loading];
};

export default useUserProjects;
