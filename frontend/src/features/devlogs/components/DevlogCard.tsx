'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Devlog } from '@/features/devlogs/types/devlog';

interface DevlogCardProps {
	devlog: Devlog;
}

export function DevlogCard({ devlog }: DevlogCardProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className="mb-4 border border-primary/20 rounded-2xl p-5 bg-white cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all duration-200"
			>
				<h4 className="text-lg font-semibold">{devlog.summary}</h4>

				<div className="text-sm text-gray-500 mt-1">
					{new Date(devlog.createdAt).toLocaleString()}
				</div>
			</div>

			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-primary/20">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-2xl font-bold text-primary">
								{devlog.summary}
							</h3>

							<button
								onClick={() => setOpen(false)}
								className="text-sm px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
							>
								Close
							</button>
						</div>

						<div className="prose prose-primary max-w-none">
							<ReactMarkdown>
								{devlog.content || ''}
							</ReactMarkdown>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
