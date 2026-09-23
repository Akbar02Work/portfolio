/** Reproducible lab measurements; requires a production build and installed Chromium. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const label = process.argv[2] ?? "current";
const output = path.resolve(root, process.env.PERF_OUTPUT_DIR ?? "logs/performance", label);
const runs = Number(process.env.PERF_RUNS ?? 3);
const port = Number(process.env.PERF_PORT ?? 4180);
const origin = `http://127.0.0.1:${port}`;
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, [path.join(root, "scripts/serve-static.mjs")], {
  cwd: root,
  env: { ...process.env, PORT: String(port), PORTFOLIO_COMPRESSION: "gzip" },
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((resolve, reject) => {
  server.stdout.once("data", resolve);
  server.once("error", reject);
  server.once("exit", (code) => reject(new Error(`Preview exited: ${code}`)));
});
let browser;
const scenarios = [
  { name: "business-desktop", url: "/", width: 1440, height: 1000, dpr: 1 },
  { name: "business-mobile", url: "/", width: 390, height: 844, dpr: 2 },
  { name: "project-desktop", url: "/projects/voicenotes", width: 1440, height: 1000, dpr: 1 },
  { name: "project-mobile", url: "/projects/voicenotes", width: 390, height: 844, dpr: 2 },
  { name: "creative-desktop", url: "/creative/", width: 1440, height: 1000, dpr: 1 },
  { name: "creative-mobile", url: "/creative/", width: 390, height: 844, dpr: 2 },
].filter(s => !process.env.PERF_SCENARIOS || process.env.PERF_SCENARIOS.split(",").includes(s.name));
const results = [];
try {
  browser = await chromium.launch();
  for (const scenario of scenarios) {
    for (let run = 1; run <= runs; run++) {
      const context = await browser.newContext({
        viewport: { width: scenario.width, height: scenario.height },
        deviceScaleFactor: scenario.dpr,
      });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Performance.enable");
      await page.addInitScript(() => {
        window.__lab = { lcp: [], shifts: [], tasks: [], ready: null };
        for (const type of ["largest-contentful-paint", "layout-shift", "longtask"]) {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (type === "largest-contentful-paint") window.__lab.lcp.push({ time: entry.startTime, tag: entry.element?.tagName, url: entry.url });
              else if (type === "layout-shift" && !entry.hadRecentInput) window.__lab.shifts.push({ time: entry.startTime, value: entry.value });
              else if (type === "longtask") window.__lab.tasks.push({ time: entry.startTime, duration: entry.duration });
            }
          }).observe({ type, buffered: true });
        }
        const ready = () => {
          const heading = document.querySelector("h1");
          if (heading && !document.body.classList.contains("is-loading")) {
            window.__lab.ready = performance.now();
          } else requestAnimationFrame(ready);
        };
        requestAnimationFrame(ready);
      });
      if (process.env.PERF_DISABLE_WEBGL === "true") await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type === "webgl" ? null : getContext.call(this, type, ...args);
        };
      });
      await page.goto(origin + scenario.url, { waitUntil: "load" });
      await page.waitForFunction(() => window.__lab.ready !== null);
      await page.waitForTimeout(2500);
      const measurements = await page.evaluate(() => ({
        ...window.__lab,
        fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
        navigation: performance.getEntriesByType("navigation")[0].toJSON(),
        resources: performance.getEntriesByType("resource").filter(e => !e.name.startsWith("data:")).map(e => ({
          path: new URL(e.name).pathname, type: e.initiatorType, start: e.startTime,
          end: e.responseEnd, transfer: e.transferSize, encoded: e.encodedBodySize,
        })),
        images: [...document.images].map(e => ({ src: e.currentSrc, width: e.clientWidth, naturalWidth: e.naturalWidth })),
      }));
      const metrics = (await cdp.send("Performance.getMetrics")).metrics;
      const row = { scenario: scenario.name, run, ...measurements, metrics };
      results.push(row);
      await writeFile(path.join(output, "loads.json"), JSON.stringify(results, null, 2));
      console.log(JSON.stringify({
        scenario: scenario.name, run, fcp: Math.round(row.fcp), lcp: Math.round(row.lcp.at(-1)?.time ?? 0),
        ready: Math.round(row.ready), cls: row.shifts.reduce((sum, e) => sum + e.value, 0),
        resourceKiB: Math.round(row.resources.reduce((sum, e) => sum + e.encoded, 0) / 1024),
        longTaskMs: Math.round(row.tasks.reduce((sum, e) => sum + Math.max(0, e.duration - 50), 0)),
      }));
      await context.close();
    }
  }
  await writeFile(path.join(output, "environment.json"), JSON.stringify({
    browser: browser.version(), node: process.version, runs, cpuSlowdown: 4,
    latencyMs: 150, downloadBytesPerSecond: 200000, compression: "gzip", cache: "disabled", scenarios,
    webglDisabled: process.env.PERF_DISABLE_WEBGL === "true",
    dist: process.env.PORTFOLIO_DIST_DIR ?? "dist", config: process.env.PORTFOLIO_CONFIG ?? "vercel.json",
  }, null, 2));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
