import { useEffect, useState } from "react";
import type { User } from "@/features/users/types/user";
import { fetchPublicUser } from "@/features/users/services/fetchPublicUser";

const usePublicUser = (
  userId: string | undefined,
  refreshUserKey?: number,
): [User | null, unknown] => {
  const [error, setError] = useState<unknown>(null);
  const [response, setResponse] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      if (!userId) return;
      try {
        const data = await fetchPublicUser(userId);
        setResponse(data);
      } catch (err) {
        console.log(err);
        setError(err);
      }
    })();
  }, [userId, refreshUserKey]);

  return [response, error];
};

export default usePublicUser;
