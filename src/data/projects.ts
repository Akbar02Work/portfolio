import type { Locale } from "@/i18n/locales";
import {
  projectsCatalog,
  projectsCatalogByLocale,
  publicProjectsCatalog,
  publicProjectsCatalogByLocale,
} from "./projectCatalog";
import type {
  ProjectFeatureCopy,
  ProjectMediaType,
  ProjectMetric,
  ProjectPlatform,
  ProjectPlatformId,
  ProjectPromo,
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
  darkImage?: string;
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
  /** Set only on a resolved platform view, so localized copy uses that same view. */
  activePlatform?: ProjectPlatformId;
  summary: string;
  role: string;
  year: number;
  metrics: ProjectMetric[];
  media: {
    type: ProjectMediaType;
    alt: string;
  };
  promo?: ProjectPromo;
  socialImage?: string;
  platforms: ProjectPlatformView[];
  overview: string;
  image: string;
  technologies: string[];
  challenge: string;
  features: ProjectFeature[];
  screens: ProjectScreen[];
  links: {
    github?: string;
    website?: string;
  };
  engineeringNote: string;
}

const toFeature = (feature: ProjectFeatureCopy): ProjectFeature =>
  typeof feature === "string" ? { title: feature } : feature;

const toProject = (project: (typeof projectsCatalog)[number]): Project => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.description,
  role: project.role,
  year: project.year,
  metrics: project.metrics,
  media: project.media,
  promo: project.promo,
  socialImage: project.socialImage,
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
    features: platform.keyFeatures.map(toFeature),
    engineeringNote: platform.engineeringNote,
  })),
  overview: project.overview,
  image: project.coverImage ?? project.gallery[0]?.imageUrl ?? "",
  technologies: project.stackAndArchitecture.stack,
  challenge: project.challenge,
  features: project.keyFeatures.map(toFeature),
  screens: project.gallery.map((screen, index) => ({
    id: `${project.slug}-${index + 1}`,
    title: screen.caption,
    description: "",
    image: toWebpPath(screen.imageUrl),
    darkImage: screen.darkImageUrl ? toWebpPath(screen.darkImageUrl) : undefined,
    platform: screen.platform ?? "android",
    mediaType: screen.mediaType ?? project.media.type,
  })),
  links: {
    github: project.links.github,
    website: project.links.website,
  },
  engineeringNote: project.engineeringNote,
});

export const allProjects: Project[] = projectsCatalog.map(toProject);

export const projects: Project[] = publicProjectsCatalog.map(toProject);

export const allProjectsByLocale: Record<Locale, Project[]> = {
  en: allProjects,
  ru: projectsCatalogByLocale.ru.map(toProject),
};

export const projectsByLocale: Record<Locale, Project[]> = {
  en: projects,
  ru: publicProjectsCatalogByLocale.ru.map(toProject),
};

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
    activePlatform: platform.id,
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

/** The same project/platform in another language; preserves ad-hoc project fixtures. */
export const getLocalizedProject = (project: Project, locale: Locale): Project => {
  const translated = allProjectsByLocale[locale].find(({ slug }) => slug === project.slug);
  return translated ? (project.activePlatform
    ? resolveProjectPlatform(translated, project.activePlatform)
    : translated) : project;
};
