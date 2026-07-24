import { ArrowUpRight } from "lucide-react";
import type { ProjectStyle } from "@/constants/projectStyles";
import type { ProjectSummary } from "@/data/projectsSummary";
import { buildProjectUrl } from "@/constants/routes";
import ProjectMediaFrame from "@/components/project/ProjectMediaFrame";
import { ViewTransitionLink } from "@/hooks/usePageTransition";

interface EditorialCardProps {
    project: ProjectSummary;
    index: number;
    reversed?: boolean;
    style: ProjectStyle;
}

const EditorialCard = ({ project, index, reversed = false, style }: EditorialCardProps) => {
    const number = String(index + 1).padStart(2, "0");
    const href = buildProjectUrl(project.slug);

    return (
        <article className="group/card flex min-h-0 flex-col justify-center border-b border-neutral-200 dark:border-neutral-800 py-12 md:min-h-[72svh] md:py-20 last:border-b-0">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
                {/* Text block */}
                <div className={`flex flex-col gap-6 md:gap-7 md:col-span-6 ${reversed ? "md:order-2" : ""}`}>
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-base text-volt-ink dark:text-volt">{number}</span>
                        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />
                        <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">{project.year}</span>
                    </div>

                    <h3 className="text-[clamp(1.75rem,2.4vw+0.75rem,2.75rem)] leading-[1.15] tracking-[-0.02em] font-bold text-gray-900 dark:text-white">
                        <ViewTransitionLink
                            to={href}
                            className="inline-flex items-baseline gap-2 transition-colors hover:text-volt-ink dark:hover:text-volt group-hover/card:text-volt-ink dark:group-hover/card:text-volt"
                        >
                            {project.title}
                            <ArrowUpRight
                                className="relative top-[0.08em] h-[0.55em] w-[0.55em] shrink-0 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:translate-y-0"
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </ViewTransitionLink>
                    </h3>

                    <p className="text-body-lg md:text-[1.375rem] leading-[1.75] text-gray-600 dark:text-slate-300 max-w-xl">
                        {project.summary}
                    </p>

                    <dl className="grid grid-cols-3 gap-5 border-t border-neutral-200 dark:border-neutral-800 pt-7 mt-1">
                        {project.metrics.map((metric) => (
                            <div key={metric.label}>
                                <dt className="sr-only">{metric.label}</dt>
                                <dd className="text-xl md:text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-gray-900 dark:text-white">
                                    {metric.value}
                                </dd>
                                <dd className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                                    {metric.label}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                        {project.technologies.join(" · ")}
                    </p>

                    <ViewTransitionLink
                        to={href}
                        className="group/cta mt-1 inline-flex w-fit items-center gap-2 border-b border-volt-ink/40 dark:border-volt/40 pb-1.5 text-base font-medium text-volt-ink transition-colors hover:border-volt-ink dark:text-volt dark:hover:border-volt"
                    >
                        Open case study
                        <ArrowUpRight
                            className="h-5 w-5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </ViewTransitionLink>
                </div>

                {/* Media block */}
                <ViewTransitionLink
                    to={href}
                    className={`relative block md:col-span-6 ${reversed ? "md:order-1" : ""} rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt-ink dark:focus-visible:outline-volt`}
                    aria-label={`Open ${project.title} case study`}
                >
                    <ProjectMediaFrame
                        image={project.image}
                        alt={project.media.alt}
                        style={style}
                    />
                </ViewTransitionLink>
            </div>
        </article>
    );
};

export default EditorialCard;
