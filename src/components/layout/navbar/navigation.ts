import { PROJECT_DETAIL_PREFIX } from "@/constants/routes";
import { stripLocale } from "@/i18n/locales";

/** Labels live in the i18n dictionary under `nav[id]`. */
export const navLinks = [
  { id: "home" },
  { id: "projects" },
  { id: "about" },
] as const;

export type NavLinkId = (typeof navLinks)[number]["id"];

export const navSectionIds = navLinks.map((link) => link.id) as NavLinkId[];

export const getDetailActiveSection = (pathname: string): NavLinkId | "" =>
  stripLocale(pathname).startsWith(PROJECT_DETAIL_PREFIX) ? "projects" : "";
