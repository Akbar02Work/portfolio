import { projects } from "./projects";
import type { ProjectMediaType, ProjectMetric } from "./projectCatalog";

const toWebpPath = (imagePath: string): string =>
  imagePath.replace(/\.(?:png|jpe?g)$/i, ".webp");

export type ProjectSummary = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  year: number;
  metrics: ProjectMetric[];
  media: {
    type: ProjectMediaType;
    alt: string;
  };
  image: string;
  technologies: string[];
};

export const projectsSummary: ProjectSummary[] = projects.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.summary,
  year: project.year,
  metrics: project.metrics,
  media: project.media,
  image: toWebpPath(project.image),
  technologies: project.technologies,
}));
