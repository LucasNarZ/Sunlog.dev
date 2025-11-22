"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";
import { Post } from "@/types/post";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import AdminPostCard from "@/components/adminPostCard";

export default function AdminDashboard() {
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
      const res = await apiClient.get(`/admin/posts?status=${status}`, {
        withCredentials: true,
      });
      setPosts(res.data as Post[]);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [status, handleApiError]);

  const updatePostLocally = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="mb-8 flex items-center gap-4">
          <label className="sr-only" htmlFor="status-select">Status</label>
          <select
            id="status-select"
            className="border rounded px-3 py-2 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDENT">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="REJECTED">Rejeitado</option>
          </select>

          <button
            onClick={fetchPosts}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-gray-700">Carregando...</p>
        ) : (
          <div className="space-y-5">
            {posts.length === 0 && (
              <p className="text-gray-600">Nenhum post encontrado.</p>
            )}

            {posts.map((post) => (
              <AdminPostCard
                key={post.id}
                post={post}
                onUpdateStatus={updatePostLocally}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
