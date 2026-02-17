import { projectsCatalog, type ProjectSlug } from "./projectCatalog";

export type ProjectSummary = {
  id: number;
  title: string;
  slug: ProjectSlug;
  subtitle: string;
  description: string;
  image: string;
  technologies: string[];
};

const buildSubtitle = (stack: string[]): string =>
  stack.slice(0, 3).join(" · ") || "Engineering Project";

export const projectsSummary: ProjectSummary[] = projectsCatalog.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  subtitle: buildSubtitle(project.stackAndArchitecture.stack),
  description: project.description,
  image: project.coverImage ?? project.gallery[0]?.imageUrl ?? "",
  technologies: project.stackAndArchitecture.stack,
}));

export type { ProjectSlug };
