import type { Locale } from "@/i18n/locales";
import { allProjects, allProjectsByLocale, projects, projectsByLocale } from "./projects";
import type { ProjectPlatformView } from "./projects";
import type {
  ProjectMediaType,
  ProjectMetric,
  ProjectPlatformId,
  ProjectPromo,
} from "./projectCatalog";

export type ProjectPlatformPreview = ProjectPlatformView & {
  image: string;
  alt: string;
};

const toWebpPath = (imagePath: string): string =>
  imagePath.replace(/\.(?:png|jpe?g)$/i, ".webp");

// The portfolio card describes the author's work. Case descriptions and the
// shared Creative catalog keep their existing product copy.
const cardDescriptions: Record<Locale, Partial<Record<string, string>>> = {
  en: {
    voicenotes: "I independently designed and built an Android voice notes app, from the Compose interface to cloud and local AI processing.",
  },
  ru: {
    voicenotes: "Самостоятельно спроектировал и разработал Android-приложение для голосовых заметок: от интерфейса на Compose до облачной и локальной AI-обработки.",
  },
};

export type ProjectSummary = {
  id: number;
  title: string;
  slug: string;
  activePlatform?: ProjectPlatformId;
  summary: string;
  year: number;
  metrics: ProjectMetric[];
  media: {
    type: ProjectMediaType;
    alt: string;
  };
  promo?: ProjectPromo;
  platforms: ProjectPlatformView[];
  platformPreviews: ProjectPlatformPreview[];
  image: string;
};

const toProjectSummary = (project: (typeof projects)[number], locale: Locale): ProjectSummary => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: cardDescriptions[locale][project.slug] ?? project.summary,
  year: project.year,
  metrics: project.metrics,
  media: project.media,
  promo: project.promo,
  platforms: project.platforms,
  platformPreviews: project.platforms.flatMap((platform) => {
    const preview = project.screens.find((screen) => screen.platform === platform.id);
    if (!preview) return [];

    return [
      {
        ...platform,
        image: preview.image,
        alt: preview.title || project.media.alt,
      },
    ];
  }),
  image: toWebpPath(project.image),
});

export const allProjectsSummary: ProjectSummary[] =
  allProjects.map((project) => toProjectSummary(project, "en"));

export const projectsSummary: ProjectSummary[] = projects.map((project) => toProjectSummary(project, "en"));

export const projectsSummaryByLocale: Record<Locale, ProjectSummary[]> = {
  en: projectsSummary,
  ru: projectsByLocale.ru.map((project) => toProjectSummary(project, "ru")),
};

export const resolveProjectSummaryPlatform = (
  project: ProjectSummary,
  platformId: ProjectPlatformId | string | null | undefined
): ProjectSummary => {
  if (project.platformPreviews.length === 0) return project;

  const platform =
    project.platformPreviews.find((candidate) => candidate.id === platformId) ??
    project.platformPreviews[0];
  if (!platform) return project;

  return {
    ...project,
    activePlatform: platform.id,
    summary: platform.summary,
    metrics: platform.metrics,
    media: {
      type: platform.mediaType,
      alt: platform.alt,
    },
    image: platform.image,
  };
};

export const getLocalizedProjectSummary = (project: ProjectSummary, locale: Locale): ProjectSummary => {
  const translated = allProjectsByLocale[locale].find(({ slug }) => slug === project.slug);
  return translated ? (project.activePlatform
    ? resolveProjectSummaryPlatform(toProjectSummary(translated, locale), project.activePlatform)
    : toProjectSummary(translated, locale)) : project;
};
