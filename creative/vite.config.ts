import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { publicProjectsCatalog } from "../src/data/projectCatalog.ts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_URL ? env.VITE_BASE_URL.replace(/\/?$/, "/") : "/";

  return {
    base,
    define: {
      __PUBLIC_PROJECT_SLUGS__: JSON.stringify(publicProjectsCatalog.map((project) => project.slug)),
    },
    plugins: [react(), basicSsl()],
    server: {
      host: true,
      port: 5174,
      strictPort: true,
    },
  };
});
