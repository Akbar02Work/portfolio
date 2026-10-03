import type { Project } from "@/data/projects";
import { useI18n } from "@/i18n/useI18n";
import { SectionLabel } from "@/components/project/SectionLabel";

type ProjectSectionProps = {
    project: Project;
};

const sectionClass = "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 md:pb-16";
const sectionRuleClass = "border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16";

export const ProjectOverviewSection = ({ project }: ProjectSectionProps) => {
    const { t } = useI18n();
    return (
        <section className={sectionClass}>
            <div className={`${sectionRuleClass} grid grid-cols-1 md:grid-cols-2 md:gap-0`}>
                <div className="md:pr-12 lg:pr-14 pb-12 md:pb-0">
                    <SectionLabel>{t.project.overview}</SectionLabel>
                    <p className="text-body-lg font-light text-gray-600 dark:text-gray-400 max-w-[65ch]">
                        {project.overview}
                    </p>
                </div>
                <div className="md:pl-12 lg:pl-14 pt-12 md:pt-0 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
                    <SectionLabel>{t.project.challenge}</SectionLabel>
                    <p className="text-body-lg font-light text-gray-600 dark:text-gray-400 max-w-[65ch]">
                        {project.challenge}
                    </p>
                </div>
            </div>
        </section>
    );
};

export const ProjectFeaturesSection = ({ project }: ProjectSectionProps) => {
    const { t } = useI18n();
    if (project.features.length === 0) return null;
    return (
        <section className={sectionClass}>
            <div className={sectionRuleClass}>
                <SectionLabel>{t.project.keyFeatures}</SectionLabel>
                <ol className="list-none mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-background dark:border-neutral-800 sm:grid-cols-2">
                    {project.features.map((feature) => (
                        <li
                            key={feature.title}
                            className="flex flex-col border-dotted border-neutral-300 p-6 transition-colors duration-300 hover:bg-neutral-50 motion-reduce:transition-none dark:border-neutral-700 dark:hover:bg-white/[0.03] max-sm:[&:nth-child(n+2)]:border-t sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-l sm:[&:last-child:nth-child(odd)]:col-span-2 md:p-8 lg:p-10"
                        >
                            <h3 className="text-[clamp(1.125rem,0.7vw+0.95rem,1.5rem)] font-semibold leading-snug tracking-[-0.02em] text-gray-900 dark:text-white">
                                {feature.title}
                            </h3>
                            {feature.description?.trim() ? (
                                <p className="mt-3 max-w-[52ch] text-body-base text-gray-500 dark:text-slate-400">
                                    {feature.description}
                                </p>
                            ) : null}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

/** Technologies grouped by their role, so related tools share one column. */
export const ProjectStackSection = ({ project }: ProjectSectionProps) => {
    const { t } = useI18n();
    const groups: Array<{ role: string; items: string[] }> = [];
    for (const tech of project.technologies) {
        const name = tech.split(" · ")[0] ?? tech;
        const role = t.project.stackRoles[name] ?? t.project.stackRoleFallback;
        const group = groups.find((entry) => entry.role === role);
        if (group) group.items.push(tech);
        else groups.push({ role, items: [tech] });
    }
    if (groups.length === 0) return null;

    return (
        <section className={sectionClass}>
            <div className={sectionRuleClass}>
                <SectionLabel>{t.project.stack}</SectionLabel>
                <dl className="mt-8 grid grid-cols-2 gap-x-6 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
                    {groups.map((group) => (
                        <div
                            key={group.role}
                            className="border-t border-neutral-200 pb-8 pt-4 dark:border-neutral-800"
                        >
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-volt-ink dark:text-volt">
                                {group.role}
                            </dt>
                            {group.items.map((tech) => (
                                <dd
                                    key={tech}
                                    className="mt-2.5 text-[clamp(1rem,0.5vw+0.875rem,1.125rem)] font-semibold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white"
                                >
                                    {tech}
                                </dd>
                            ))}
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
};
