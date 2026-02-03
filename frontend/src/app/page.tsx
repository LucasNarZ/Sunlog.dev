import Header from '@components/Header';
import TrendingUsers from '@/features/users/components/TrendingUsers';
import HeroSection from '@/components/HeroSection';
import { fetchProjects } from '@/features/projects/services/fetchProjects';
import { ProjectCard } from '@/features/projects/components/ProjectCard';

export default async function Home() {
    const projects = await fetchProjects();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
            <Header />

            <div className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                </div>

                <div className="flex flex-col items-center pt-16 px-4 pb-20">
                    <HeroSection />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-24">
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900">
                                Latest Projects
                            </h2>
                            <p className="text-neutral-600 mt-1">
                                Discover what developers are building
                            </p>
                        </div>
                    </div>

                    {!projects ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-red-600 font-semibold text-lg mb-2">
                                Error loading projects
                            </p>
                            <p className="text-neutral-500 text-sm">
                                Please try again later or refresh the page
                            </p>
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project: any) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-6 shadow-inner">
                                <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-neutral-700 font-semibold text-lg mb-2">
                                No projects yet
                            </p>
                            <p className="text-neutral-500 text-sm text-center max-w-md">
                                Be the first to share your development journey with the community
                            </p>
                            <button className="mt-6 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200">
                                Create First Project
                            </button>
                        </div>
                    )}
                </section>

                <section>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-50/50 via-transparent to-pink-50/50 rounded-3xl -z-10" />
                        <TrendingUsers />
                    </div>
                </section>
            </div>

        </div>
    );
}
