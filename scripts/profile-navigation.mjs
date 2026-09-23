/** Cold and repeat visits through the actual version links, under the load lab's throttling. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve(process.env.PERF_OUTPUT_DIR ?? "logs/performance", process.argv[2] ?? "current");
await mkdir(output, { recursive: true });
const origin = "http://127.0.0.1:4182";
const server = spawn(process.execPath, ["scripts/serve-static.mjs"], {
  env: { ...process.env, PORT: "4182", PORTFOLIO_COMPRESSION: "gzip" },
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((resolve, reject) => {
  server.stdout.once("data", resolve);
  server.once("error", reject);
  server.once("exit", code => reject(new Error(`Preview exited: ${code}`)));
});
let browser;
const rows = [];
const runs = Number(process.env.PERF_RUNS ?? 3);
const projectFlow = process.env.PERF_FLOW === "projects";
const reportName = projectFlow ? "project-navigation" : "navigation";
try {
  browser = await chromium.launch();
  for (let run = 1; run <= runs; run++) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.__usable = null;
      const tick = () => {
        if (document.querySelector("h1") && !document.querySelector(".preloader") && !document.body.classList.contains("is-loading")) {
          window.__usable = performance.now();
        } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto(origin);
    await page.waitForTimeout(2500);
    for (const stage of (projectFlow ? ["project-open", "project-return"] : ["creative-first", "business-return", "creative-return"])) {
      const started = projectFlow ? await page.evaluate(() => performance.now()) : 0;
      const linkName = projectFlow
        ? (stage === "project-open" ? "Open case study" : "Back to projects")
        : (stage.startsWith("creative") ? "Creative" : "Business");
      await page.getByRole("link", { name: linkName, exact: true }).click();
      if (projectFlow) {
        await page.waitForURL(url => url.pathname === (stage === "project-open" ? "/projects/voicenotes" : "/"));
        await page.waitForFunction(() => {
          const overlay = document.querySelector(".page-transition-overlay");
          const cover = document.querySelector('[aria-label="Show screen 1"] img');
          return overlay && getComputedStyle(overlay).pointerEvents === "none" && (!cover || (cover.complete && cover.naturalWidth > 0));
        });
      } else {
        await page.waitForURL(origin + (stage.startsWith("creative") ? "/creative/" : "/"));
        await page.waitForFunction(() => window.__usable !== null);
      }
      const usable = await page.evaluate(({ projectFlow, started }) => projectFlow ? performance.now() - started : window.__usable, { projectFlow, started });
      await page.waitForTimeout(2500);
      const row = { run, stage, usable, ...await page.evaluate(started => ({
        resources: performance.getEntriesByType("resource").filter(e => !e.name.startsWith("data:") && e.startTime >= started).map(e => ({
          path: new URL(e.name).pathname, transfer: e.transferSize, encoded: e.encodedBodySize,
        })),
      }), started) };
      rows.push(row);
      console.log(JSON.stringify({ run, stage, usable: Math.round(row.usable), transferredKiB: Math.round(row.resources.reduce((sum, e) => sum + e.transfer, 0) / 1024) }));
      await writeFile(path.join(output, `${reportName}.json`), JSON.stringify(rows, null, 2));
    }
    await context.close();
  }
  await writeFile(path.join(output, `${reportName}-environment.json`), JSON.stringify({
    browser: browser.version(), node: process.version, runs, viewport: { width: 1440, height: 1000 },
    cpuSlowdown: 4, latencyMs: 150, downloadBytesPerSecond: 200000, compression: "gzip", cache: "enabled",
    dist: process.env.PORTFOLIO_DIST_DIR ?? "dist", config: process.env.PORTFOLIO_CONFIG ?? "vercel.json",
    flow: projectFlow ? "projects" : "versions",
  }, null, 2));
} finally {
  await browser?.close(); server.kill("SIGTERM");
}
