import { PROJECT_DETAIL_PREFIX } from "@/constants/routes";
import { stripLocale } from "@/i18n/locales";

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
] as const;

export type NavLinkId = (typeof navLinks)[number]["id"];

export const navSectionIds = navLinks.map((link) => link.id) as NavLinkId[];

export const getDetailActiveSection = (pathname: string): NavLinkId | "" =>
  stripLocale(pathname).startsWith(PROJECT_DETAIL_PREFIX) ? "projects" : "";
