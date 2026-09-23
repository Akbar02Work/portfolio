/** Local release checks for the static output and the rules in vercel.json. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.resolve(root, process.env.PORTFOLIO_DIST_DIR ?? "dist");
const compressedFiles = new Map();
const config = JSON.parse(await readFile(path.resolve(root, process.env.PORTFOLIO_CONFIG ?? "vercel.json"), "utf8"));
const port = Number(process.env.PORT ?? 4173);
const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".map": "application/json",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
  ".avif": "image/avif", ".jpg": "image/jpeg", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".pdf": "application/pdf", ".webmanifest": "application/manifest+json",
};

// Only the route patterns used by this repository, not a Vercel emulator.
const matchRoute = (source, pathname) => {
  const pattern = source.replace(/:[a-zA-Z]+\*/g, "(.*)").replace(/:[a-zA-Z]+/g, "([^/]+)");
  return new RegExp(`^${pattern}$`).exec(pathname);
};

const findFile = async (pathname) => {
  const candidate = path.resolve(dist, `.${pathname}`);
  if (!candidate.startsWith(`${dist}${path.sep}`) && candidate !== dist) return null;
  try {
    if ((await stat(candidate)).isFile()) return candidate;
    const index = path.join(candidate, "index.html");
    return (await stat(index)).isFile() ? index : null;
  } catch {
    return null;
  }
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    for (const rule of config.headers ?? []) {
      if (matchRoute(rule.source, pathname)) {
        for (const header of rule.headers) res.setHeader(header.key, header.value);
      }
    }

    const redirect = config.redirects?.find((rule) => matchRoute(rule.source, pathname));
    if (redirect) {
      res.writeHead(redirect.permanent ? 308 : 307, { Location: redirect.destination + url.search });
      res.end();
      return;
    }

    let file = await findFile(pathname);
    if (!file) {
      const rewrite = config.rewrites?.find((rule) => matchRoute(rule.source, pathname));
      if (rewrite) {
        const values = matchRoute(rewrite.source, pathname).slice(1);
        let i = 0;
        const destination = rewrite.destination.replace(/:[a-zA-Z]+\*?/g, () => values[i++]);
        file = await findFile(destination);
      }
    }

    const status = file ? 200 : 404;
    const output = file ?? path.join(dist, "404.html");
    let body = await readFile(output);
    if (process.env.PORTFOLIO_COMPRESSION === "gzip" && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "") && /\.(html|js|css|svg|json|xml|txt)$/.test(output)) {
      if (!compressedFiles.has(output)) compressedFiles.set(output, gzipSync(body));
      body = compressedFiles.get(output);
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Vary", "Accept-Encoding");
    }
    res.setHeader("Content-Length", body.length);
    res.writeHead(status, { "Content-Type": mimeTypes[path.extname(output)] ?? "application/octet-stream" });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(400);
    res.end("Bad request");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Static release preview: http://127.0.0.1:${port}`));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
