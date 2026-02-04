'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/apiClient';
import useMe from '@/features/users/hooks/useMe';

interface Comment {
    id: string;
    content: string;
    author: {
        name: string;
        profileImgUrl?: string;
    };
    commentParentId: string | null;
    createdAt: string;
    children?: Comment[];
}

interface CommentsProps {
    postId: string;
}

const CommentsSection = ({ postId }: CommentsProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [userData] = useMe();
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(
        null,
    );
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newComment]);

    const fetchComments = async () => {
        try {
            const res = await apiClient.get(`post/${postId}/comments`);
            const data: Comment[] = res.data;
            setComments(buildCommentTree(data));
        } catch (err) {
            console.error(err);
        }
    };

    const buildCommentTree = (flatComments: Comment[]): Comment[] => {
        const map = new Map<string, Comment>();
        const roots: Comment[] = [];

        flatComments.forEach((comment) => {
            comment.children = [];
            map.set(comment.id, comment);
        });

        flatComments.forEach((comment) => {
            if (comment.commentParentId) {
                const parent = map.get(comment.commentParentId);
                if (parent) parent.children!.push(comment);
            } else {
                roots.push(comment);
            }
        });

        return roots;
    };

    const handleSubmit = async (parentId?: string) => {
        if (!newComment.trim()) return;
        setLoading(true);

        try {
            let contentToSend = newComment;
            if (replyTo && newComment.startsWith(`@${replyTo.name} `)) {
                contentToSend = newComment.slice(replyTo.name.length + 2);
            }

            await apiClient.post(`post/${postId}/comments`, {
                content: contentToSend,
                commentParentId: parentId || replyTo?.id || null,
            });

            setNewComment('');
            setReplyTo(null);
            fetchComments();
        } catch (err) {
            console.error(err);
            alert('Error');
        } finally {
            setLoading(false);
        }
    };

    const handleReplyClick = (comment: Comment) => {
        setReplyTo({ id: comment.id, name: comment.author.name });
        setNewComment(`@${comment.author.name} `);
        textareaRef.current?.focus();
    };

    const renderComments = (commentsList: Comment[], level = 0) => {
        return commentsList.map((comment) => (
            <div key={comment.id} className="relative ml-0 mt-6">
                <div
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 shadow-sm relative min-w-0"
                    style={{ marginLeft: `${level * 1.5}rem` }}
                >
                    <Image
                        src={
                            comment.author.profileImgUrl ||
                            'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png'
                        }
                        alt="author"
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 break-words w-full">
                        <span className="font-medium text-gray-800">
                            {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-400 pl-2">
                            {new Date(comment.createdAt).toLocaleString()}
                        </span>
                        <p className="mt-1 text-gray-700 w-10/12">
                            {comment.content}
                        </p>
                        <div className="mt-2 flex gap-3 text-sm">
                            <button
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => handleReplyClick(comment)}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>

                {comment.children && comment.children.length > 0 && (
                    <div className="mt-2">
                        {renderComments(comment.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="max-w-3xl w-full mt-10 pb-10">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>

            <div className="flex items-start gap-3 mb-4">
                <Image
                    src={
                        userData?.profileImgUrl ||
                        'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png'
                    }
                    alt="current user"
                    width={40}
                    height={40}
                    className="rounded-full flex-shrink-0"
                />
                <div className="flex-1 flex flex-col gap-2">
                    <textarea
                        ref={textareaRef}
                        placeholder="Write a comment..."
                        className="border p-3 rounded-lg resize-none w-full overflow-hidden"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        onClick={() => handleSubmit(replyTo?.id)}
                        disabled={loading}
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Sending...' : 'Comment'}
                    </button>
                </div>
            </div>

            <div className="mt-6">{renderComments(comments)}</div>
        </div>
    );
};

export default CommentsSection;
