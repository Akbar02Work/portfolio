import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { Project } from "@/data/projects";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";
import { ViewTransitionLink } from "@/hooks/usePageTransition";

type ProjectHeaderProps = {
    project: Project;
};

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
    const sanitizedGithubLink = project.links.github
        ? sanitizeUrl(project.links.github)
        : null;
    const githubHref =
        sanitizedGithubLink && isAllowedExternalUrl(sanitizedGithubLink)
            ? sanitizedGithubLink
            : null;

    return (
        <header className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 md:pt-14 pb-12 md:pb-16">
            <div className="grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] sm:gap-6">
                <ViewTransitionLink
                    to={ROUTES.HOME}
                    state={{ scrollTo: "projects" }}
                    className="group inline-flex items-center gap-2 justify-self-start pt-2 font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-volt-ink dark:text-neutral-400 dark:hover:text-volt"
                >
                    <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
                    <span className="hidden sm:inline">Back to projects</span>
                    <span className="sm:hidden">Back</span>
                </ViewTransitionLink>

                <div className="order-3 col-span-2 min-w-0 text-center sm:order-none sm:col-span-1">
                    <h1 className="text-heading-1 text-gray-900 dark:text-white">
                        {project.title}
                    </h1>
                    <p className="text-body-lg text-gray-600 dark:text-slate-300 mt-4 max-w-xl mx-auto">
                        {project.summary}
                    </p>
                </div>

                {githubHref ? (
                    <a
                        href={githubHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 justify-self-end pt-2 font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-volt-ink dark:text-neutral-400 dark:hover:text-volt"
                    >
                        GitHub
                        <ArrowUpRight
                            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2}
                        />
                    </a>
                ) : (
                    <span className="justify-self-end" aria-hidden="true" />
                )}
            </div>
        </header>
    );
};
