import { Languages, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProjectStyle = {
  gradient: string;
  icon: LucideIcon;
  hoverBorder: string;
};

/* Project identity stays inside media; portfolio chrome uses one shared accent. */
const MUTED_GRADIENT =
  "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900";
const PROJECT_HOVER_BORDER = "hover:border-volt-ink dark:hover:border-volt";

const projectStyleEntries = [
  {
    slug: "voicenotes",
    style: {
      gradient: MUTED_GRADIENT,
      icon: Mic,
      hoverBorder: PROJECT_HOVER_BORDER,
    },
  },
  {
    slug: "lumingo",
    style: {
      gradient:
        "bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950 dark:to-neutral-900",
      icon: Languages,
      hoverBorder: PROJECT_HOVER_BORDER,
    },
  },
] as const;

export const projectStylesBySlug: Record<string, ProjectStyle> = Object.fromEntries(
  projectStyleEntries.map((entry) => [entry.slug, entry.style])
);

export const fallbackProjectStyle: ProjectStyle = {
  gradient: MUTED_GRADIENT,
  icon: Mic,
  hoverBorder: PROJECT_HOVER_BORDER,
};
