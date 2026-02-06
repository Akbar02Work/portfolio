import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

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
  const devHost = env.VITE_DEV_HOST || "127.0.0.1";
  const isProd = mode === "production";
  const sourcemap = !isProd || env.VITE_SOURCEMAP === "true";
  const devPort = Number(env.VITE_DEV_PORT) || 8080;
  const appVersion = getPackageVersion();
  const gitCommitSha = getGitCommitSha();

  return {
    base,
    server: {
      host: devHost,
      port: devPort,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
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
