import { projects } from "./projects";
import type { ProjectPlatformView } from "./projects";
import type {
  ProjectMediaType,
  ProjectMetric,
  ProjectPlatformId,
} from "./projectCatalog";

export type ProjectPlatformPreview = ProjectPlatformView & {
  image: string;
  alt: string;
};

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
  platforms: ProjectPlatformView[];
  platformPreviews: ProjectPlatformPreview[];
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
  technologies: project.technologies,
}));

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
    summary: platform.summary,
    metrics: platform.metrics,
    media: {
      type: platform.mediaType,
      alt: platform.alt,
    },
    image: platform.image,
    technologies: platform.technologies,
  };
};
