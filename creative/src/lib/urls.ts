/** Prefix a root-relative public asset with Vite `base` (e.g. `/` or `/creative/`). */
export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = path.replace(/^\//, "");
  return `${base}${normalized}`;
};
