import { projectsCatalog } from "./projectCatalog";
import type {
  ProjectMediaType,
  ProjectMetric,
  ProjectPlatform,
  ProjectPlatformId,
} from "./projectCatalog";

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
  platform: ProjectPlatformId;
  mediaType: ProjectMediaType;
}

export interface ProjectPlatformView extends ProjectPlatform {
  summary: string;
  role: string;
  metrics: ProjectMetric[];
  overview: string;
  technologies: string[];
  challenge: string;
  features: ProjectFeature[];
  engineeringNote: string;
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
  platforms: ProjectPlatformView[];
  overview: string;
  image: string;
  technologies: string[];
  challenge: string;
  features: ProjectFeature[];
  screens: ProjectScreen[];
  links: {
    github?: string;
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
  platforms: (project.platforms ?? []).map((platform) => ({
    id: platform.id,
    label: platform.label,
    status: platform.status,
    mediaType: platform.mediaType,
    summary: platform.summary,
    role: platform.role,
    metrics: platform.metrics,
    overview: platform.overview,
    technologies: platform.stack,
    challenge: platform.challenge,
    features: platform.keyFeatures.map((feature) => ({ title: feature })),
    engineeringNote: platform.engineeringNote,
  })),
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
    platform: screen.platform ?? "android",
    mediaType: screen.mediaType ?? project.media.type,
  })),
  links: {
    github: project.links.github,
  },
  engineeringNote: project.engineeringNote,
}));

export const resolveProjectPlatform = (
  project: Project,
  platformId: ProjectPlatformId | string | null | undefined
): Project => {
  if (project.platforms.length === 0) return project;

  const platform =
    project.platforms.find((candidate) => candidate.id === platformId) ??
    project.platforms[0];
  if (!platform) return project;

  const platformImage = project.screens.find(
    (screen) => screen.platform === platform.id
  );

  return {
    ...project,
    summary: platform.summary,
    role: platform.role,
    metrics: platform.metrics,
    media: {
      ...project.media,
      type: platform.mediaType,
      alt: platformImage?.title || project.media.alt,
    },
    overview: platform.overview,
    image: platformImage?.image ?? project.image,
    technologies: platform.technologies,
    challenge: platform.challenge,
    features: platform.features,
    engineeringNote: platform.engineeringNote,
  };
};
