'use client';

import { Devlog } from '@/features/devlogs/types/devlog';
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';

interface AdminPostCardProps {
    post: Devlog;
    onUpdateStatus?: (updatedPost: Devlog) => void;
}

export default function AdminPostCard({
    post,
    onUpdateStatus,
}: AdminPostCardProps) {
    const [loading, setLoading] = useState(false);

    async function updateStatus(newStatus: 'APPROVED' | 'REJECTED') {
        setLoading(true);
        try {
            // await apiClient.patch(
            //     `admin/devlogEvents/${post.id}`,
            //     { status: newStatus },
            //     { withCredentials: true },
            // );
            //
            // if (onUpdateStatus) {
            //     onUpdateStatus({ ...post, statusId: newStatus });
            // }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border rounded-xl p-5 bg-white shadow-sm flex justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-[70%]">
                <h2 className="text-xl font-semibold">{post.summary}</h2>
                <p className="text-gray-600">{post.description}</p>

                <p className="text-sm text-gray-500 break-words">
                    Conteúdo: {post.content}
                </p>

                <p className="text-xs text-gray-400">
                    Criado em: {new Date(post.createdAt).toLocaleString()}
                </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
                <button
                    onClick={() => updateStatus('APPROVED')}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white transition ${loading
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    Aprovar
                </button>

                <button
                    onClick={() => updateStatus('REJECTED')}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white transition ${loading
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                        }`}
                >
                    Rejeitar
                </button>
            </div>
        </div >
    );
}
