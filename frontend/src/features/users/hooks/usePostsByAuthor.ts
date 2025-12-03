import { useEffect, useState } from "react";
import { Post } from "@/features/devlogs/types/post";
import { apiClient } from "@lib/apiClient";

const useDevlogEventsByAuthor = (
  userId: string | undefined,
): [Post[] | null, unknown | null] => {
  const [devlogEvents, setDevlogEvents] = useState<Post[] | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      try {
        const response = await apiClient.get("/users/" + userId + "/devlogEvents");
        setDevlogEvents(response.data);
      } catch (err) {
        setError(err);
      }
    })();
  }, [userId]);

  return [devlogEvents, error];
};

export default useDevlogEventsByAuthor;
