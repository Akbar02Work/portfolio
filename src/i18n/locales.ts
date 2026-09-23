export const LOCALES = ["en", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** localStorage key for an explicit choice made in the language switch. */
export const LOCALE_STORAGE_KEY = "locale";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

const RU_PREFIX = /^\/ru(?=\/|\?|#|$)/;

/** Locale encoded in a router pathname ("/ru/..." → ru, everything else → en). */
export const localeFromPath = (pathname: string): Locale =>
  RU_PREFIX.test(pathname) ? "ru" : DEFAULT_LOCALE;

/** Removes the locale prefix: "/ru/projects/x" → "/projects/x", "/ru" → "/". */
export const stripLocale = (path: string): string => {
  const stripped = path.replace(RU_PREFIX, "");
  if (stripped === "") return "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
};

/**
 * Adds the locale prefix to an app path (query/hash preserved).
 * "/" → "/ru", "/projects/x?platform=web" → "/ru/projects/x?platform=web".
 */
export const localizePath = (path: string, locale: Locale): string => {
  if (!path.startsWith("/")) return path;
  const neutral = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return neutral;
  if (neutral === "/") return "/ru";
  if (neutral.startsWith("/?") || neutral.startsWith("/#")) return `/ru${neutral.slice(1)}`;
  return `/ru${neutral}`;
};

export const HTML_LANG: Record<Locale, string> = { en: "en", ru: "ru" };

export const OG_LOCALE: Record<Locale, string> = { en: "en_US", ru: "ru_RU" };

/** Default social preview image per language. */
export const OG_IMAGE: Record<Locale, string> = { en: "/og-image.png", ru: "/og-image-ru.png" };
