import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { apiClient } from "@lib/apiClient";

const useFollow = (
  followedId: string | undefined,
): [boolean | null, Dispatch<SetStateAction<boolean | null>>, unknown] => {
  const [error, setError] = useState<unknown>(null);
  const [response, setResponse] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      if (!followedId) return;
      try {
        const response = await apiClient.get(`/follow/${followedId}`);
        setResponse(response.data);
      } catch (err) {
        setError(err);
      }
    })();
  }, [followedId]);

  return [response, setResponse, error];
};

export default useFollow;
