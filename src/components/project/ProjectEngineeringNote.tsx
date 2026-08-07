import type { Project } from "@/data/projects";

type ProjectEngineeringNoteProps = {
    project: Project;
};

export const ProjectEngineeringNote = ({ project }: ProjectEngineeringNoteProps) => {
    const role = project.role?.trim();
    const note = project.engineeringNote?.trim();
    if (!role && !note) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 md:pb-16">
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                <div className="flex items-center gap-4 mb-6">
                    <span
                        className="inline-block h-px w-8 shrink-0 bg-[var(--project-accent)]"
                        aria-hidden="true"
                    />
                    <h2 className="text-heading-2 text-gray-900 dark:text-white">
                        Engineering note
                    </h2>
                </div>

                <aside className="max-w-3xl">
                    {role ? (
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-3">
                            {role}
                        </p>
                    ) : null}
                    {note ? (
                        <p className="font-mono text-body-base md:text-body-lg leading-relaxed text-gray-700 dark:text-slate-300">
                            {note}
                        </p>
                    ) : null}
                </aside>
            </div>
        </section>
    );
};
