import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { buildProjectUrl } from "@/constants/routes";
import { ViewTransitionLink } from "@/hooks/usePageTransition";

interface NextProjectTeaserProps {
    project: Project;
}

const NextProjectTeaser = ({ project }: NextProjectTeaserProps) => (
    <section className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
            <ViewTransitionLink to={buildProjectUrl(project.slug)} className="group block">
                <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-6">
                    Next project
                </p>
                <div className="flex items-center justify-between gap-6">
                    <span className="text-heading-1 font-semibold text-gray-900 dark:text-white group-hover:text-[var(--project-accent)] transition-colors duration-200">
                        {project.title}
                    </span>
                    <ArrowUpRight
                        className="flex-none w-8 h-8 md:w-12 md:h-12 text-[var(--project-accent)] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                </div>
                <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mt-6">
                    {project.role} · {project.year}
                </p>
            </ViewTransitionLink>
        </div>
    </section>
);

export default NextProjectTeaser;
