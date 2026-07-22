import { Mic, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProjectStyle = {
  gradient: string;
  icon: LucideIcon;
  hoverBorder: string;
};

const projectStyleEntries = [
  {
    slug: "voicenotes",
    style: {
      gradient: "bg-gradient-to-br from-fuchsia-500 to-pink-500",
      icon: Mic,
      hoverBorder: "hover:border-fuchsia-500 dark:hover:border-fuchsia-400",
    },
  },
  {
    slug: "secbench-25",
    style: {
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
      icon: Shield,
      hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
    },
  },
] as const;

export const projectStylesBySlug: Record<string, ProjectStyle> = Object.fromEntries(
  projectStyleEntries.map((entry) => [entry.slug, entry.style])
);

export const fallbackProjectStyle: ProjectStyle = {
  gradient: "bg-gray-100",
  icon: Mic,
  hoverBorder: "",
};
