/** CPU/call-count evidence for fixed scroll and WebGL scenarios; not a device FPS benchmark. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const label = process.argv[2] ?? "current";
const output = path.resolve(process.env.PERF_OUTPUT_DIR ?? "logs/performance", label);
await mkdir(output, { recursive: true });
const origin = "http://127.0.0.1:4181";
const server = spawn(process.execPath, ["scripts/serve-static.mjs"], {
  env: { ...process.env, PORT: "4181", PORTFOLIO_COMPRESSION: "gzip" },
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((resolve, reject) => {
  server.stdout.once("data", resolve);
  server.once("error", reject);
  server.once("exit", code => reject(new Error(`Preview exited: ${code}`)));
});
let browser;
const rows = [];
try {
  browser = await chromium.launch();
  for (const url of (process.env.PERF_ROUTES?.split(",") ?? ["/", "/projects/voicenotes", "/creative/"])) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Performance.enable");
    await cdp.send("Profiler.enable");
    await page.addInitScript(() => {
      window.__calls = {};
      window.__renders = { portfolio: 0, preloader: 0 };
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true, inject: () => 1, onCommitFiberUnmount() {},
        onCommitFiberRoot(_id, root) {
          const visit = fiber => {
            if (!fiber) return;
            if (typeof fiber.type === "function" && (fiber.flags & 1)) {
              if (fiber.memoizedProps?.onCopyEmail) window.__renders.portfolio++;
              if (fiber.memoizedProps?.onExitComplete) window.__renders.preloader++;
            }
            visit(fiber.child); visit(fiber.sibling);
          }; visit(root.current);
        },
      };
      const wrap = (object, key, name = key) => {
        const original = object[key];
        object[key] = function (...args) {
          const start = performance.now();
          const result = original.apply(this, args);
          const bucket = window.__calls[name] ??= { count: 0, ms: 0 };
          bucket.count++; bucket.ms += performance.now() - start;
          return result;
        };
      };
      for (const key of ["getAttribLocation", "drawArrays", "getShaderParameter", "getProgramParameter", "getUniformLocation"]) wrap(WebGLRenderingContext.prototype, key);
      wrap(Element.prototype, "getBoundingClientRect");
      wrap(window, "getComputedStyle");
      wrap(HTMLCanvasElement.prototype, "toDataURL");
    });
    await cdp.send("Profiler.start");
    await page.goto(origin + url);
    await page.waitForTimeout(4000);
    const startup = await cdp.send("Profiler.stop");
    const name = url === "/" ? "business" : url.startsWith("/projects") ? "project" : "creative";
    await writeFile(path.join(output, `${name}-startup.cpuprofile`), JSON.stringify(startup.profile));
    rows.push({ name, stage: "startup", calls: await page.evaluate(() => window.__calls), renders: await page.evaluate(() => window.__renders) });
    for (const stage of ["idle", "scroll", ...(name === "creative" ? ["pointer"] : [])]) {
      await page.evaluate(() => { window.__calls = {}; window.__renders = { portfolio: 0, preloader: 0 }; });
      const before = (await cdp.send("Performance.getMetrics")).metrics;
      await cdp.send("Profiler.start");
      if (stage === "idle") await page.waitForTimeout(4000);
      else if (stage === "pointer") {
        for (let i = 0; i < 80; i++) {
          await page.mouse.move(100 + (i % 40) * 30, 350 + Math.sin(i / 8) * 120);
          await page.waitForTimeout(50);
        }
      } else {
        await page.evaluate(() => new Promise(resolve => {
          const started = performance.now();
          const tick = now => {
            window.scrollTo(0, Math.min(1, (now - started) / 4000) * (document.documentElement.scrollHeight - innerHeight));
            if (now - started < 4000) requestAnimationFrame(tick); else resolve();
          }; requestAnimationFrame(tick);
        }));
      }
      const profile = await cdp.send("Profiler.stop");
      await writeFile(path.join(output, `${name}-${stage}.cpuprofile`), JSON.stringify(profile.profile));
      const after = (await cdp.send("Performance.getMetrics")).metrics;
      const metrics = Object.fromEntries(after.filter(m => /Duration|Count/.test(m.name)).map(m => [m.name, m.value - (before.find(p => p.name === m.name)?.value ?? 0)]));
      const row = { name, stage, metrics, calls: await page.evaluate(() => window.__calls), renders: await page.evaluate(() => window.__renders) };
      rows.push(row); console.log(JSON.stringify(row));
    }
    await page.goto(origin + url);
    await page.waitForTimeout(1500);
    rows.push({ name, stage: "warm-reload", resources: await page.evaluate(() => performance.getEntriesByType("resource").filter(e => !e.name.startsWith("data:")).map(e => ({ path: new URL(e.name).pathname, transfer: e.transferSize, encoded: e.encodedBodySize }))) });
    await context.close();
    await writeFile(path.join(output, "interactions.json"), JSON.stringify(rows, null, 2));
  }
  await writeFile(path.join(output, "interactions-environment.json"), JSON.stringify({
    browser: browser.version(), node: process.version, cpuSlowdown: 4, cache: "enabled", network: "unthrottled",
    viewport: { width: 1440, height: 1000 }, compression: "gzip",
    routes: process.env.PERF_ROUTES?.split(",") ?? ["/", "/projects/voicenotes", "/creative/"],
    dist: process.env.PORTFOLIO_DIST_DIR ?? "dist", config: process.env.PORTFOLIO_CONFIG ?? "vercel.json",
  }, null, 2));
} finally {
  await browser?.close(); server.kill("SIGTERM");
}
