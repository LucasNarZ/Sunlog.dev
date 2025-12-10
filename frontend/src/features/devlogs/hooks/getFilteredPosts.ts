import { useEffect, useState } from "react";
import { apiClient } from "@lib/apiClient";
import type { Post } from "@/features/devlogs/types/devlog";

export const useDevlogEventsByTag = (tags: string[], categorys: string[]) => {
  const [devlogEvents, setDevlogEvents] = useState<Post[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = new URLSearchParams();
        tags.forEach((tag) => params.append("tag", tag));
        categorys.forEach((cat) => params.append("category", cat));
        const { data } = await apiClient.get(`/devlogEvents?${params}`);
        setDevlogEvents(data);
        setError(null);
      } catch (err) {
        setError(err);
      }
    };
    fetch();
  }, [tags, categorys]);

  return [devlogEvents, error] as const;
};
