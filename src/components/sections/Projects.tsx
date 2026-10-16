import { LocalizedText } from "@/components/ui/LocalizedText";
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
            <section id="projects" className="pt-24 pb-12 bg-background">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Section header — editorial numbering */}
                    <header className="mb-6 md:mb-10">
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-4">
                            <LocalizedText scramble>{copy => copy.projects.eyebrow}</LocalizedText>
                        </p>
                        <h2 className="text-heading-1 text-gray-900 dark:text-white"><LocalizedText>{copy => copy.projects.title}</LocalizedText></h2>
                    </header>

                    {/* Numbered editorial list */}
                    <div>
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
