import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { publicProjectsCatalogByLocale } from "./src/data/projectCatalog";
import { SITE_URL } from "./src/data/siteMetadata";
import { HTML_LANG, LOCALES, OG_LOCALE, localizePath, type Locale } from "./src/i18n/locales";
import { messages } from "./src/i18n/messages";
import { HERO_PORTRAIT_SIZES, heroPortraitSrcSet } from "./src/data/heroPortrait";
import { prerenderRoutes, type PrerenderRoute } from "./scripts/prerender";

const alternatesFor = (neutralPath: string) => [
  ...LOCALES.map((locale) => ({ hrefLang: HTML_LANG[locale], path: localizePath(neutralPath, locale) })),
  { hrefLang: "x-default", path: localizePath(neutralPath, "en") },
];

const localeRouteFields = (locale: Locale, neutralPath: string) => ({
  path: localizePath(neutralPath, locale),
  preloadFonts: locale === "ru" ? ["/fonts/Inter-cyrillic.woff2"] : undefined,
  lang: HTML_LANG[locale],
  ogLocale: OG_LOCALE[locale],
  siteName: messages[locale].seo.siteName,
  alternates: alternatesFor(neutralPath),
});

const publicRoutes: PrerenderRoute[] = LOCALES.flatMap((locale): PrerenderRoute[] => [
  {
    ...localeRouteFields(locale, "/"),
    title: messages[locale].seo.homeTitle,
    description: messages[locale].seo.homeDescription,
    image: "/og-image.png",
  },
  ...publicProjectsCatalogByLocale[locale].map(
    (project): PrerenderRoute => ({
      ...localeRouteFields(locale, `/projects/${project.slug}`),
      title: messages[locale].seo.projectTitle(project.title),
      description: project.description,
      image: project.coverImage || "/og-image.png",
    })
  ),
]);

const getPackageVersion = () => {
  try {
    const raw = readFileSync(path.resolve(__dirname, "package.json"), "utf-8");
    const parsed = JSON.parse(raw) as { version?: string };
    return typeof parsed.version === "string" ? parsed.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
};

const getGitCommitSha = () => {
  try {
    return execSync("git rev-parse --short=7 HEAD", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_URL ? env.VITE_BASE_URL.replace(/\/?$/, "/") : "/";
  const devHost = env.VITE_DEV_HOST || true;
  const isProd = mode === "production";
  const sourcemap = !isProd || env.VITE_SOURCEMAP === "true";
  const shouldAnalyze = process.env.ANALYZE === "true";
  const devPort = Number(env.VITE_DEV_PORT) || 5173;
  const appVersion = getPackageVersion();
  const gitCommitSha = getGitCommitSha();
  const routes = publicRoutes.map((route): PrerenderRoute => {
    if (route.path === "/" || route.path === localizePath("/", "ru")) {
      return {
        ...route,
        preloadImage: {
          src: `${base}avatar.webp`,
          type: "image/webp",
          srcSet: heroPortraitSrcSet("webp", base),
          sizes: HERO_PORTRAIT_SIZES,
        },
      };
    }
    const avif = route.image.replace(/\.(png|webp|jpe?g)$/i, ".avif").replace(/^\//, "");
    return {
      ...route,
      preloadImage: avif.endsWith(".avif") && existsSync(path.resolve(__dirname, "public", avif))
        ? { src: `${base}${avif}`, type: "image/avif" }
        : undefined,
    };
  });

  return {
    base,
    server: {
      host: devHost,
      port: devPort,
      strictPort: true,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      prerenderRoutes({ siteUrl: SITE_URL, routes }),
      ...(shouldAnalyze
        ? [
            visualizer({
              filename: "dist/stats.html",
              gzipSize: true,
              brotliSize: true,
              open: false,
              template: "treemap",
            }),
          ]
        : []),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
      __GIT_COMMIT_SHA__: JSON.stringify(gitCommitSha),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap,
      reportCompressedSize: true,
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        },
      },
    },
  };
});
