import { PROJECT_DETAIL_PREFIX } from "@/constants/routes";

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
] as const;

// Contact is an action (opens the contact dialog), not a scroll section.
export const CONTACT_NAV_LABEL = "Contact";

export type NavLinkId = (typeof navLinks)[number]["id"];

export const navSectionIds = navLinks.map((link) => link.id) as NavLinkId[];

export const getDetailActiveSection = (pathname: string): NavLinkId | "" =>
  pathname.startsWith(PROJECT_DETAIL_PREFIX) ? "projects" : "";
