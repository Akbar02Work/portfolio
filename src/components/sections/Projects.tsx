import { AnimatedSection } from "@/components/AnimatedSection";
import EditorialCard from "@/components/project/EditorialCard";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { fallbackProjectStyle, projectStylesBySlug } from "@/constants/projectStyles";
import type { ProjectSummary } from "@/data/projectsSummary";

type ProjectsProps = {
    projects: ProjectSummary[];
};

export const Projects = ({ projects }: ProjectsProps) => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.PROJECTS_SECTION}>
            <section id="projects" className="py-24 bg-background">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Section header — editorial numbering */}
                    <header className="mb-6 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-4">
                                01 / Works
                            </p>
                            <h2 className="text-heading-1 text-gray-900 dark:text-white">Selected Works</h2>
                        </div>
                        <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400 sm:pb-1.5">
                            Click a project for the full case →
                        </p>
                    </header>

                    {/* Numbered editorial list */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800">
                        {projects.map((project, index) => (
                            <EditorialCard
                                key={project.id}
                                project={project}
                                index={index}
                                reversed={index % 2 === 1}
                                style={projectStylesBySlug[project.slug] ?? fallbackProjectStyle}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
