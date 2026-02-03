'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Devlog } from '@/features/devlogs/types/devlog';

interface DevlogCardProps {
    devlog: Devlog;
}

export function DevlogCard({ devlog }: DevlogCardProps) {
    const [open, setOpen] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        if (open) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open]);

    const formattedDate = new Date(devlog.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            {/* Card */}
            <div
                onClick={() => setOpen(true)}
                className="group relative border border-neutral-200 rounded-2xl p-6 bg-white cursor-pointer hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
                {/* Gradient accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {devlog.summary}
                        </h4>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                            <svg
                                className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formattedDate}</span>
                    </div>

                    {devlog.content && (
                        <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
                            {devlog?.description?.substring(0, 150)}...
                        </p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white max-w-4xl w-full max-h-[90vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 flex items-start justify-between gap-6 p-8 pb-6 border-b border-neutral-200">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-3xl font-bold text-neutral-900 mb-3">
                                    {devlog.summary}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-neutral-500">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{formattedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="flex-shrink-0 group p-2 rounded-xl hover:bg-neutral-100 transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="w-6 h-6 text-neutral-400 group-hover:text-neutral-900 transition-colors duration-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 pt-6">
                            {devlog.content ? (
                                <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-neutral-100 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:rounded-xl prose-pre:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-neutral-50 prose-blockquote:rounded-r-lg prose-img:rounded-xl prose-img:shadow-md">
                                    <ReactMarkdown>{devlog.content}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-neutral-500 font-medium">No content available</p>
                                    <p className="text-sm text-neutral-400 mt-1">This devlog entry doesn't have any detailed content yet</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 flex items-center justify-end gap-3 p-6 pt-4 border-t border-neutral-200 bg-neutral-50">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-6 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
