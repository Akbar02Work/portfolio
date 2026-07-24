import { projectsCatalog } from "./projectCatalog";
import type { ProjectMediaType, ProjectMetric } from "./projectCatalog";

const toWebpPath = (imagePath: string): string =>
  imagePath.replace(/\.(?:png|jpe?g)$/i, ".webp");

export interface ProjectFeature {
  title: string;
  description?: string;
}

export interface ProjectScreen {
  id: string;
  title: string;
  description?: string;
  image: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string;
  role: string;
  year: number;
  metrics: ProjectMetric[];
  media: {
    type: ProjectMediaType;
    alt: string;
  };
  overview: string;
  image: string;
  technologies: string[];
  challenge: string;
  features: ProjectFeature[];
  screens: ProjectScreen[];
  links: {
    github: string;
  };
  engineeringNote: string;
}

export const projects: Project[] = projectsCatalog.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.description,
  role: project.role,
  year: project.year,
  metrics: project.metrics,
  media: project.media,
  overview: project.overview,
  image: project.coverImage ?? project.gallery[0]?.imageUrl ?? "",
  technologies: project.stackAndArchitecture.stack,
  challenge: project.challenge,
  features: project.keyFeatures.map((feature) => ({
    title: feature,
  })),
  screens: project.gallery.map((screen, index) => ({
    id: `${project.slug}-${index + 1}`,
    title: screen.caption,
    description: "",
    image: toWebpPath(screen.imageUrl),
  })),
  links: {
    github: project.links.github,
  },
  engineeringNote: project.engineeringNote,
}));
