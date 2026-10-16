import { LocalizedText } from "@/components/ui/LocalizedText";
import { getLocalizedProject, type Project } from "@/data/projects";
import { ProjectArchitecture } from "@/components/project/ProjectArchitecture";
import { SectionLabel } from "@/components/project/SectionLabel";

type ProjectEngineeringNoteProps = {
    project: Project;
};

export const ProjectEngineeringNote = ({ project }: ProjectEngineeringNoteProps) => {
    const note = project.engineeringNote?.trim();
    if (!note) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 md:pb-16">
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                <SectionLabel><LocalizedText>{copy => copy.project.engineeringNote}</LocalizedText></SectionLabel>

                <ProjectArchitecture slug={project.slug} />

                <p className="max-w-3xl text-body-lg leading-relaxed text-gray-600 dark:text-slate-300">
                    <LocalizedText>{(_, locale) => getLocalizedProject(project, locale).engineeringNote}</LocalizedText>
                </p>
            </div>
        </section>
    );
};
