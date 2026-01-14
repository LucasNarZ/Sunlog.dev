import Header from '@/components/Header';
import { fetchProjectDevlogs } from '@/features/devlogs/services/fetchProjectDevlogs';
import { fetchProject } from '@/features/projects/services/fetchProject';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

type PageProps = {
	params: {
		username: string;
		projectName: string;
	};
};

export default async function ProjectPage({ params }: PageProps) {
	const awaitedParams = await params;
	const projectPath = `${awaitedParams.username}/${awaitedParams.projectName}`;
	const project = await fetchProject(projectPath);
	if (!project) return notFound();

	const devlogs = await fetchProjectDevlogs(project.id);

	return (
		<>
			<Header />
			<div className="max-w-7xl mx-auto min-h-screen px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
				<main className="space-y-10">
					<section>
						<h1 className="text-3xl font-bold">
							{project.name.split('/').pop()}
						</h1>

						<h2 className="text-xl font-semibold mt-10 mb-4">
							Timeline
						</h2>

						<div className="flex flex-col gap-4 relative before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-neutral-200">
							{devlogs.length > 0 ? (
								devlogs.map((d: any) => (
									<a
										key={d.id}
										href={`/devlog/${d.id}`}
										className="relative pl-8 border rounded-lg p-4 bg-white hover:bg-neutral-50 transition"
									>
										<div className="absolute left-[1px] top-6 w-3 h-3 rounded-full bg-neutral-400" />

										<div className="text-lg font-medium">
											{d.summary || 'Untitled event'}
										</div>

										<div className="text-sm opacity-70 mt-1">
											{new Date(
												d.createdAt,
											).toLocaleString()}
										</div>

										{d.content && (
											<p className="text-sm mt-2 line-clamp-3 text-neutral-700">
												{d.content}
											</p>
										)}
									</a>
								))
							) : (
								<div className="opacity-60 pl-8">
									No devlog events yet.
								</div>
							)}
						</div>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-4">README</h2>

						<div className="prose max-w-none border rounded-xl p-6 bg-white">
							{project.readme ? (
								<ReactMarkdown>{project.readme}</ReactMarkdown>
							) : (
								<div className="opacity-60">
									No README provided.
								</div>
							)}
						</div>
					</section>
				</main>

				<aside className="space-y-4">
					<div className="border rounded-xl p-4 bg-gray-50">
						<div className="text-sm text-neutral-500">Author</div>
						<div className="font-medium">
							{project.user?.username}
						</div>

						<div className="mt-4 text-sm text-neutral-500">
							About
						</div>
						<div className="mt-1 text-sm whitespace-pre-line text-neutral-700">
							{project.description || 'No description provided'}
						</div>
					</div>
				</aside>
			</div>
		</>
	);
}
