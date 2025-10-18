import { useEffect, useState } from "react";
import { apiClient } from "@lib/apiClient";
import type { User } from "@/types/user";

const useAuthor = (): [User | null, unknown, boolean] => {
  const [error, setError] = useState<unknown>(null);
  const [response, setResponse] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/user/profile`, {
          withCredentials: true,
        });
        setResponse(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
        setError(err);
      }
    })();
  }, []);

  return [response, error, loading];
};

export default useAuthor;
