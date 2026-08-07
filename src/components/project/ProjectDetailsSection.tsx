import type { Project } from "@/data/projects";

type ProjectDetailsSectionProps = {
    project: Project;
};

const STACK_ROLES: Record<string, string> = {
  Kotlin: "language",
  "Jetpack Compose": "ui",
  "Gemini API": "ai",
  "OpenAI API": "ai",
  "Groq API": "ai",
  "sherpa-onnx": "on-device asr",
  Room: "storage",
  WorkManager: "model delivery",
  Hilt: "di",
};

const stackRole = (tech: string) => STACK_ROLES[tech] ?? "module";

const SectionLabel = ({ children }: { children: string }) => (
    <div className="flex items-center gap-4 mb-6">
        <span
            className="inline-block h-px w-8 shrink-0 bg-[var(--project-accent)]"
            aria-hidden="true"
        />
        <h2 className="text-heading-2 text-gray-900 dark:text-white">{children}</h2>
    </div>
);

export const ProjectDetailsSection = ({ project }: ProjectDetailsSectionProps) => (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 md:pb-24">
        {/* Overview + Challenge */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-2 md:gap-0">
            <div className="md:pr-12 lg:pr-14 pb-12 md:pb-0">
                <SectionLabel>Overview</SectionLabel>
                <p className="text-body-lg font-light text-gray-600 dark:text-gray-400 max-w-[65ch]">
                    {project.overview}
                </p>
            </div>
            <div className="md:pl-12 lg:pl-14 pt-12 md:pt-0 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
                <SectionLabel>The Challenge</SectionLabel>
                <p className="text-body-lg font-light text-gray-600 dark:text-gray-400 max-w-[65ch]">
                    {project.challenge}
                </p>
            </div>
        </div>

        {/* Stack + Key Features */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16 mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 md:gap-0">
            <div className="md:pr-12 lg:pr-14 pb-12 md:pb-0">
                <SectionLabel>Stack</SectionLabel>
                <ul className="list-none grid grid-cols-2 gap-x-8 gap-y-8 sm:gap-x-10 sm:gap-y-10">
                    {project.technologies.map((tech) => (
                        <li key={tech} className="flex flex-col items-start">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--project-accent)]">
                                {stackRole(tech)}
                            </span>
                            <span className="mt-3 text-[clamp(1rem,0.8vw+0.85rem,1.25rem)] leading-tight tracking-[-0.02em] font-semibold text-gray-900 dark:text-white min-h-[2.5em]">
                                {tech}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="md:pl-12 lg:pl-14 pt-12 md:pt-0 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
                <SectionLabel>Key Features</SectionLabel>
                <ul className="list-none relative pl-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-200 dark:before:bg-neutral-800">
                    {project.features.map((feature) => (
                        <li key={feature.title} className="relative pb-6 last:pb-0">
                            <span
                                className="absolute -left-6 top-2 h-2 w-2 rounded-full bg-[var(--project-accent)] ring-4 ring-background"
                                aria-hidden="true"
                            />
                            <p className="text-[clamp(1rem,0.8vw+0.85rem,1.2rem)] leading-snug tracking-[-0.015em] font-medium text-gray-900 dark:text-white">
                                {feature.title}
                            </p>
                            {feature.description?.trim() ? (
                                <p className="mt-2 text-body-base font-light text-gray-500 dark:text-gray-400 max-w-[65ch]">
                                    {feature.description}
                                </p>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);
