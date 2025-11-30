import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { Post } from "@/features/devlogs/types/post";
import { useRouter } from "next/navigation";

export function useAdminPosts() {
  const router = useRouter();
  const [status, setStatus] = useState("PENDENT");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleApiError = useCallback(
    (err: any) => {
      if (err.response?.status === 403) router.push("/");
      else console.error(err);
    },
    [router]
  );

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/admin/posts?status=${status}`, { withCredentials: true });
      setPosts(res.data as Post[]);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [status, handleApiError]);

  const updatePostLocally = useCallback((updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { status, setStatus, posts, loading, fetchPosts, updatePostLocally };
}
