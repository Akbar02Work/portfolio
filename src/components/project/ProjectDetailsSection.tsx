import { ChevronDown } from "lucide-react";
import type { Project } from "@/data/projects";

type ProjectDetailsSectionProps = {
  project: Project;
  openFeatureIndex: number | null;
  setOpenFeatureIndex: (index: number | null) => void;
};

export const ProjectDetailsSection = ({
  project,
  openFeatureIndex,
  setOpenFeatureIndex,
}: ProjectDetailsSectionProps) => (
  <>
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 my-4 sm:my-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
    </div>

    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-14">
        <div className="space-y-6">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="h-px w-6 sm:w-8 md:w-10 bg-gray-300 dark:bg-gray-700"></div>
            <h2 className="text-heading-2 text-gray-900 dark:text-white">Overview</h2>
          </div>
          <p className="text-body-lg text-gray-600 dark:text-gray-400">
            {project.description}
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="h-px w-6 sm:w-8 md:w-10 bg-gray-300 dark:bg-gray-700"></div>
            <h2 className="text-heading-2 text-gray-900 dark:text-white">The Challenge</h2>
          </div>
          <p className="text-body-lg text-gray-600 dark:text-gray-400">
            {project.challenge}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl my-4 sm:my-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
      </div>

      <div className="pt-4 sm:pt-6 pb-8 sm:pb-10">
        <div className="flex items-center gap-5 md:gap-6 mb-6">
          <div className="h-px w-8 sm:w-10 md:w-12 bg-gray-300 dark:bg-gray-700"></div>
          <h3 className="text-heading-2 text-gray-900 dark:text-white">Technologies</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-full text-caption text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500 transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl my-4 sm:my-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
      </div>

      <div className="pt-4 sm:pt-6 mb-12">
        <div className="flex items-center gap-5 md:gap-6 mb-6">
          <div className="h-px w-8 sm:w-10 md:w-12 bg-gray-300 dark:bg-gray-700"></div>
          <h3 className="text-heading-2 text-gray-900 dark:text-white">Key Features</h3>
        </div>

        <div className="flex flex-col">
          {project.features.map((feature, index) => {
            const isOpen = openFeatureIndex === index;
            const buttonId = `feature-toggle-${index}`;
            const panelId = `feature-panel-${index}`;

            return (
              <div key={feature.title} className="pt-4">
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenFeatureIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 pb-4 text-left group transition-colors hover:text-gray-900 dark:hover:text-gray-200"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className={`text-body-lg font-medium transition-colors duration-300 ${isOpen ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                    }`}>
                    {feature.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-gray-900 dark:text-white" : "group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}
                  />
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out-expo ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
                    <p className="text-body-base text-gray-500 dark:text-gray-400 pr-4 md:pr-12 pb-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  </>
);
