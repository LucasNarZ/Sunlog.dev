import Header from '@/components/Header';
import { DevlogCard } from '@/features/devlogs/components/DevlogCard';
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
            <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                            <span className="hover:text-neutral-900 transition-colors cursor-pointer">
                                {project.user?.username}
                            </span>
                            <span className="text-neutral-400">/</span>
                            <span className="font-medium text-neutral-900">
                                {project.name.split('/').pop()}
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                            {project.name.split('/').pop()}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                        <main className="space-y-12">
                            {/* Timeline Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                    <h2 className="text-2xl font-bold text-neutral-900">
                                        Development Timeline
                                    </h2>
                                </div>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent" />

                                    <div className="space-y-6">
                                        {devlogs.length > 0 ? (
                                            devlogs.map((d: any, index: number) => (
                                                <div
                                                    key={d.id}
                                                    className="group relative pl-16 block"
                                                >
                                                    {/* Timeline dot */}
                                                    <div className="absolute left-[18px] top-7 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-4 ring-white shadow-lg group-hover:scale-125 transition-transform duration-200" />

                                                    {/* Card */}
                                                    <DevlogCard devlog={d} />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="pl-16 py-8 text-center">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                                                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <p className="text-neutral-500 font-medium">No development logs yet</p>
                                                <p className="text-sm text-neutral-400 mt-1">Updates will appear here as the project progresses</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* README Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                                    <h2 className="text-2xl font-bold text-neutral-900">
                                        README
                                    </h2>
                                </div>
                                <div className="border border-neutral-200 rounded-2xl p-8 bg-white shadow-sm">
                                    {project.readme ? (
                                        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:text-neutral-100">
                                            <ReactMarkdown>{project.readme}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                                                <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-neutral-500 font-medium">No README provided</p>
                                            <p className="text-sm text-neutral-400 mt-1">Documentation will be displayed here</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </main>

                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                            {/* Author Card */}
                            <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        <img
                                            className="object-cover w-full h-full"
                                            src={
                                                project?.user?.previewImgUrl ||
                                                'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png'
                                            }
                                            alt="Profile"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
                                            Created by
                                        </div>
                                        <div className="font-semibold text-neutral-900">
                                            {project.user?.username}
                                        </div>
                                    </div>
                                </div>

                                {project.description && (
                                    <>
                                        <div className="h-px bg-neutral-200 my-4" />
                                        <div>
                                            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-2">
                                                About
                                            </div>
                                            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                                                {project.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="border border-neutral-200 rounded-2xl p-6 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
                                <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-4">
                                    Project Stats
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-600">Updates</span>
                                        <span className="font-semibold text-neutral-900">{devlogs.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-600">Last activity</span>
                                        <span className="font-semibold text-neutral-900">
                                            {devlogs.length > 0
                                                ? new Date(devlogs[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : 'N/A'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div >
        </>
    );
}
