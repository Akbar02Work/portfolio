import { projects } from "./projects";

export type ProjectSummary = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  technologies: string[];
};

export const projectsSummary: ProjectSummary[] = projects.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.summary,
  image: project.image,
  technologies: project.technologies,
}));
