import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { publicProjectsCatalog } from "./src/data/projectCatalog";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_URL } from "./src/data/siteMetadata";
import { HERO_PORTRAIT_SIZES, heroPortraitSrcSet } from "./src/data/heroPortrait";
import { prerenderRoutes, type PrerenderRoute } from "./scripts/prerender";

const projectRoutes = publicProjectsCatalog.map(
  (project): PrerenderRoute => ({
    path: `/projects/${project.slug}`,
    title: `${project.title} | Akbar Azizov`,
    description: project.description,
    image: project.coverImage || "/og-image.png",
  })
);

const publicRoutes: PrerenderRoute[] = [
  {
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    image: "/og-image.png",
  },
  ...projectRoutes,
];

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
    if (route.path === "/") {
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
