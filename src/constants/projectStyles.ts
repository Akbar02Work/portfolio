import { Languages, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProjectStyle = {
  gradient: string;
  icon: LucideIcon;
  hoverBorder: string;
  accentColor: string;
};

/* MONO/VOLT: media surfaces are neutral, the accent lives in the volt hover border */
const MUTED_GRADIENT =
  "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900";
const PROJECT_HOVER_BORDER = "hover:border-[var(--project-accent)]";

const projectStyleEntries = [
  {
    slug: "voicenotes",
    style: {
      gradient: MUTED_GRADIENT,
      icon: Mic,
      hoverBorder: PROJECT_HOVER_BORDER,
      accentColor: "#2F6364",
    },
  },
  {
    slug: "lumingo",
    style: {
      gradient:
        "bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950 dark:to-neutral-900",
      icon: Languages,
      hoverBorder: PROJECT_HOVER_BORDER,
      accentColor: "#E85D04",
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
  accentColor: "#2F6364",
};
