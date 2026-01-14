"use client";

import { useAdminDevlogEvents } from "@/features/admin/hooks/useAdminDevlogEvents";
import Header from "@/components/Header";
import AdminPostCard from "@/features/admin/components/adminPostCard";

export default function AdminDashboard() {
  const {
    status,
    setStatus,
    devlogEvents,
    loading,
    fetchDevlogEvents,
    updatePostLocally,
  } = useAdminDevlogEvents();

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="mb-8 flex items-center gap-4">
          <select
            className="border rounded px-3 py-2 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDENT">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="REJECTED">Rejeitado</option>
          </select>

          <button
            onClick={fetchDevlogEvents}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-gray-700">Carregando...</p>
        ) : devlogEvents.length === 0 ? (
          <p className="text-gray-600">Nenhum post encontrado.</p>
        ) : (
          <div className="space-y-5">
            {devlogEvents.map((post) => (
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
