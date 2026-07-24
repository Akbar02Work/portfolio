import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { projectsCatalog } from "./src/data/projectCatalog";
import { prerenderRoutes, type PrerenderRoute } from "./scripts/prerender";

const SITE_URL = "https://www.akbar02work.xyz";
const HOME_TITLE = "Akbar — Android & AI Engineer";
const HOME_DESCRIPTION =
  "Android apps built with Kotlin and Jetpack Compose, with practical AI integrations.";
const PUBLIC_PROJECT_SLUGS = ["voicenotes"] as const;

const projectRoutes = PUBLIC_PROJECT_SLUGS.map((slug): PrerenderRoute => {
  const project = projectsCatalog.find((candidate) => candidate.slug === slug);
  if (!project) {
    throw new Error(`Missing project data for prerender route: ${slug}`);
  }

  return {
    path: `/projects/${slug}`,
    title: `${project.title} | Akbar Azizov`,
    description: project.description,
    image: project.coverImage || "/og-image.png",
  };
});

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
      prerenderRoutes({ siteUrl: SITE_URL, routes: publicRoutes }),
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
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("@sentry")) return "monitoring";
            if (id.includes("react-router") || id.includes("@remix-run/router")) return "router";
            if (id.includes("@radix-ui") || id.includes("lucide-react")) return "ui";
            return "vendor";
          },
        },
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
    },
  };
});
