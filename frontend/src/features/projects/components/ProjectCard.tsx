import Link from 'next/link';
import { Project } from '@/features/projects/types/project';

interface ProjectCardProps {
    project: Project;
}


export function ProjectCard({ project }: ProjectCardProps) {
    1;
    return (
        <Link
            key={project.id}
            href={`/${project.authorSlug}/${project.slug}`}
            className="group border border-primary/20 rounded-2xl p-5 bg-white transition-all duration-200 hover:shadow-lg hover:border-primary/40"
        >
            <h4 className="text-lg font-semibold group-hover:text-primary/90 transition">
                {project.name}
            </h4>

            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {project.description || 'No description'}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition">
                View project
                <span className="transform transition group-hover:translate-x-1">
                    →
                </span>
            </div>
        </Link>
    );
}
