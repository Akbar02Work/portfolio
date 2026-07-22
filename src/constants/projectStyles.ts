import { Mic, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProjectStyle = {
  gradient: string;
  icon: LucideIcon;
  hoverBorder: string;
};

/* MONO/VOLT: media surfaces are neutral, the accent lives in the volt hover border */
const MUTED_GRADIENT =
  "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900";
const VOLT_HOVER_BORDER = "hover:border-volt-ink dark:hover:border-volt";

const projectStyleEntries = [
  {
    slug: "voicenotes",
    style: {
      gradient: MUTED_GRADIENT,
      icon: Mic,
      hoverBorder: VOLT_HOVER_BORDER,
    },
  },
  {
    slug: "secbench-25",
    style: {
      gradient: MUTED_GRADIENT,
      icon: Shield,
      hoverBorder: VOLT_HOVER_BORDER,
    },
  },
] as const;

export const projectStylesBySlug: Record<string, ProjectStyle> = Object.fromEntries(
  projectStyleEntries.map((entry) => [entry.slug, entry.style])
);

export const fallbackProjectStyle: ProjectStyle = {
  gradient: MUTED_GRADIENT,
  icon: Mic,
  hoverBorder: VOLT_HOVER_BORDER,
};
