import { fetchProjectDevlogs } from '@/features/devlogs/services/fetchProjectDevlogs';
import { fetchProject } from '@/features/projects/services/fetchProject';
import { notFound } from 'next/navigation'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const project = await fetchProject(params.slug)
    if (!project) return notFound()

    const devlogs = await fetchProjectDevlogs(project.id)

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="text-sm mt-1">
                <span>by </span>
                <span className="font-medium">{project.user.username}</span>
            </div>

            <div className="mt-6 whitespace-pre-line border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
                {project.description || 'No description provided'}
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Timeline</h2>

            <div className="flex flex-col gap-4">
                {devlogs.map((d: any) => (
                    <a
                        key={d.id}
                        href={`/devlog/${d.id}`}
                        className="border rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                        <div className="text-lg font-medium">{d.summary || 'Untitled event'}</div>
                        <div className="text-sm opacity-70 mt-1">{new Date(d.createdAt).toLocaleString()}</div>
                        {d.content && (
                            <p className="text-sm mt-2 line-clamp-3">
                                {d.content}
                            </p>
                        )}
                    </a>
                ))}

                {devlogs.length === 0 && (
                    <div className="opacity-60">No devlog events yet.</div>
                )}
            </div>
        </div>
    )
}

