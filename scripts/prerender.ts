import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

export interface PrerenderRoute {
  path: string;
  title: string;
  description: string;
  image: string;
  preloadImage?: { src: string; type?: string; srcSet?: string; sizes?: string };
}

interface PrerenderOptions {
  siteUrl: string;
  routes: PrerenderRoute[];
}

const SEO_META_KEYS = [
  "title",
  "description",
  "og:type",
  "og:url",
  "og:title",
  "og:description",
  "og:image",
  "og:site_name",
  "twitter:card",
  "twitter:url",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeSiteUrl = (siteUrl: string): string =>
  `${siteUrl.replace(/\/+$/, "")}/`;

const validateRoutes = (routes: PrerenderRoute[]): void => {
  const paths = new Set<string>();

  for (const route of routes) {
    if (!route.path.startsWith("/") || route.path.includes("..")) {
      throw new Error(`Invalid prerender route: ${route.path}`);
    }
    if (route.path !== "/" && route.path.endsWith("/")) {
      throw new Error(`Prerender route must not have a trailing slash: ${route.path}`);
    }
    if (paths.has(route.path)) {
      throw new Error(`Duplicate prerender route: ${route.path}`);
    }
    paths.add(route.path);
  }
};

const renderRouteHtml = (
  template: string,
  route: PrerenderRoute,
  siteUrl: string
): string => {
  const canonicalUrl = new URL(route.path, siteUrl).toString();
  const imageUrl = new URL(route.image, siteUrl).toString();
  const metaKeyPattern = SEO_META_KEYS.map(escapeRegExp).join("|");

  const withoutRouteSeo = template
    .replace(/\s*<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, "\n")
    .replace(
      new RegExp(
        `\\s*<meta\\b[^>]*(?:name|property)\\s*=\\s*["'](?:${metaKeyPattern})["'][^>]*\\/?>(?:\\s*)`,
        "gi"
      ),
      "\n"
    )
    .replace(/\s*<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*\/?>\s*/gi, "\n")
    .replace(/\s*<!-- Route-specific prerendered SEO -->\s*/gi, "\n");

  const tags = [
    "  <!-- Route-specific prerendered SEO -->",
    `  <title>${escapeHtml(route.title)}</title>`,
    `  <meta name="title" content="${escapeHtml(route.title)}" />`,
    `  <meta name="description" content="${escapeHtml(route.description)}" />`,
    `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    '  <meta property="og:type" content="website" />',
    `  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `  <meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `  <meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `  <meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    '  <meta property="og:site_name" content="Akbar Azizov Portfolio" />',
    '  <meta name="twitter:card" content="summary_large_image" />',
    `  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />`,
    `  <meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `  <meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
  ].map((tag) => tag.replace(/^ {2}<(meta|link)\b/, '  <$1 data-rh="true"')).join("\n");
  const preload = route.preloadImage;
  // Omit href for responsive hints: older WebKit scanners fetch it in addition to imagesrcset.
  const imageHint = preload ? [
    '\n  <link rel="preload" as="image"',
    preload.srcSet ? "" : ` href="${escapeHtml(preload.src)}"`,
    preload.type ? ` type="${escapeHtml(preload.type)}"` : "",
    preload.srcSet ? ` imagesrcset="${escapeHtml(preload.srcSet)}"` : "",
    preload.sizes ? ` imagesizes="${escapeHtml(preload.sizes)}"` : "",
    " />",
  ].join("") : "";

  if (!withoutRouteSeo.includes("</head>")) {
    throw new Error("Cannot prerender routes: dist/index.html has no </head> tag");
  }

  return withoutRouteSeo.replace("</head>", `${tags}${imageHint}\n</head>`);
};

const routeOutputPath = (outDir: string, routePath: string): string =>
  routePath === "/"
    ? path.join(outDir, "index.html")
    : path.join(outDir, routePath.slice(1), "index.html");

export const prerenderRoutes = ({ siteUrl, routes }: PrerenderOptions): Plugin => {
  validateRoutes(routes);
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  let resolvedConfig: ResolvedConfig;

  return {
    name: "prerender-public-routes",
    apply: "build",
    configResolved(config) {
      resolvedConfig = config;
    },
    async closeBundle() {
      const outDir = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir);
      const template = await readFile(path.join(outDir, "index.html"), "utf8");

      await Promise.all(
        routes.map(async (route) => {
          const outputPath = routeOutputPath(outDir, route.path);
          await mkdir(path.dirname(outputPath), { recursive: true });
          await writeFile(
            outputPath,
            renderRouteHtml(template, route, normalizedSiteUrl),
            "utf8"
          );
        })
      );

      const sitemapUrls = [...routes.map((route) => route.path), "/creative/"];
      await writeFile(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
          .map((routePath) => `  <url><loc>${escapeHtml(new URL(routePath, normalizedSiteUrl).href)}</loc></url>`)
          .join("\n")}\n</urlset>\n`,
        "utf8"
      );

      resolvedConfig.logger.info(
        `prerendered ${routes.length} public routes: ${routes
          .map((route) => route.path)
          .join(", ")}`
      );
    },
  };
};
