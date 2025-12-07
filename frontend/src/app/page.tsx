import Header from "@components/Header"
import TrendingUsers from "@/features/users/components/TrendingUsers"
import HeroSection from "@/components/HeroSection"
import { fetchProjects } from "@/features/projects/services/fetchProjects"

export default async function Home() {
    const projects = await fetchProjects()

    return (
        <div>
            <Header />

            <div className="min-h-[100vh] w-full flex flex-col items-center pt-16 px-4 pb-16">
                <HeroSection />

                <div className="mt-16 w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-6">Latest Projects</h2>

                    {!projects ? (
                        <div className="text-red-600 text-center">
                            Error loading projects. Please try again later.
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((project: any) => (
                                <a
                                    key={project.id}
                                    href={`/project/${project.user.username}/${project.name}`}
                                    className="border rounded-xl p-5 hover:bg-neutral-50 transition"
                                >
                                    <div className="text-lg font-semibold">
                                        {project.name.split('/').pop()}
                                    </div>

                                    <div className="text-sm text-neutral-500 mt-1">
                                        by {project.user.username}
                                    </div>

                                    <div className="text-sm mt-3 text-neutral-700 line-clamp-3">
                                        {project.description || "No description provided"}
                                    </div>

                                    <div className="text-xs text-neutral-400 mt-4">
                                        Created at {new Date(project.createdAt).toLocaleDateString()}
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-600 text-center">
                            No projects found.
                        </div>
                    )}
                </div>

                <div className="w-full max-w-6xl mt-20">
                    <TrendingUsers />
                </div>
            </div>
        </div>
    )
}

