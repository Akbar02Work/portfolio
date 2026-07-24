import type { ProjectStyle } from "@/constants/projectStyles";
import type { Project } from "@/data/projects";
import ProjectMediaFrame from "@/components/project/ProjectMediaFrame";

interface ProjectGalleryProps {
    project: Project;
    style: ProjectStyle;
}

const ProjectGallery = ({ project, style }: ProjectGalleryProps) => {
    const uniqueScreens = project.screens.filter(
        (screen, index, screens) =>
            screens.findIndex((candidate) => candidate.image === screen.image) === index
    );

    return (
        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 md:pb-24 lg:px-12">
            <div className="border-t border-neutral-200 pt-12 dark:border-neutral-800 md:pt-16">
                <div className="mb-8 flex items-center gap-4 md:mb-10">
                    <span
                        className="inline-block h-px w-8 shrink-0 bg-volt-ink dark:bg-volt"
                        aria-hidden="true"
                    />
                    <h2 className="text-heading-2 text-gray-900 dark:text-white">Screens</h2>
                </div>

                {uniqueScreens.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <ProjectMediaFrame
                            image=""
                            alt=""
                            style={style}
                            phoneClassName="w-44 sm:w-52"
                        />
                    </div>
                ) : (
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {uniqueScreens.map((screen, index) => (
                            <figure key={screen.id} className="flex flex-col items-center gap-4">
                                <ProjectMediaFrame
                                    image={screen.image}
                                    alt={screen.title || project.media.alt}
                                    style={style}
                                    phoneClassName="w-44 sm:w-52"
                                    priority={index === 0}
                                />
                                <figcaption className="max-w-xs text-center font-mono text-caption text-neutral-500 dark:text-neutral-400">
                                    {screen.title}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectGallery;
