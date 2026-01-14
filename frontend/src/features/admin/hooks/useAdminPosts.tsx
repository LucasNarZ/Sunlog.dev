import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { Post } from "@/features/devlogs/types/devlog";
import { useRouter } from "next/navigation";

export function useAdminDevlogEvents() {
  const router = useRouter();
  const [status, setStatus] = useState("PENDENT");
  const [devlogEvents, setDevlogEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleApiError = useCallback(
    (err: any) => {
      if (err.response?.status === 403) router.push("/");
      else console.error(err);
    },
    [router],
  );

  const fetchDevlogEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/admin/devlogEvents?status=${status}`, {
        withCredentials: true,
      });
      setDevlogEvents(res.data as Post[]);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [status, handleApiError]);

  const updatePostLocally = useCallback((updatedPost: Post) => {
    setDevlogEvents((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    );
  }, []);

  useEffect(() => {
    fetchDevlogEvents();
  }, [fetchDevlogEvents]);

  return {
    status,
    setStatus,
    devlogEvents,
    loading,
    fetchDevlogEvents,
    updatePostLocally,
  };
}
