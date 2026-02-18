import { Link } from "react-router-dom";
import { ArrowLeft, Github } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { Project } from "@/data/projects";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 pb-6">
        <div className="w-full md:w-1/4 flex justify-start order-1">
          <Link
            to={ROUTES.HOME}
            state={{ scrollTo: "projects" }}
            className="group inline-flex items-center text-button text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>
        <div className="w-full md:w-1/2 text-center order-2">
          <h1 className="text-heading-1 text-gray-900 dark:text-white mb-3">
            {project.title}
          </h1>
          <p className="text-body-lg font-light text-gray-500 dark:text-gray-400">
            {project.summary}
          </p>
        </div>
        <div className="w-full md:w-1/4 flex justify-end order-3">
          {githubHref && (
            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-button rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-gray-200 dark:shadow-none"
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
