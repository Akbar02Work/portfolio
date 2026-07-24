#!/usr/bin/env node
/**
 * Keeps Business (5173) + Creative (5174) Vite servers alive with auto-restart.
 *
 *   npm run dev:pair
 *   npm run dev:pair:stop
 */
import { spawn, execSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const pidFile = path.join(root, ".dev-portfolios.pid");
const logFile = path.join(root, ".dev-portfolios.log");
const restartDelayMs = 1200;

const sites = [
  {
    name: "business",
    cwd: root,
    port: 5173,
    npmArgs: ["run", "dev", "--", "--port", "5173", "--strictPort", "--host"],
    url: "http://127.0.0.1:5173/",
  },
  {
    name: "creative",
    cwd: path.join(root, "creative"),
    port: 5174,
    npmArgs: ["run", "dev", "--", "--port", "5174", "--strictPort", "--host"],
    url: "https://127.0.0.1:5174/",
  },
];

const children = new Map();
let shuttingDown = false;

const log = (message) => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  try {
    writeFileSync(logFile, line, { flag: "a" });
  } catch {
    // Logging must not stop the development servers.
  }
};

const freePort = (port) => {
  try {
    const output = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!output) return;

    for (const pid of output.split(/\s+/)) {
      try {
        process.kill(Number(pid), "SIGTERM");
        log(`freed :${port} (killed pid ${pid})`);
      } catch {
        // The process may already be gone.
      }
    }
  } catch {
    // Nothing is listening on this port.
  }
};

const stopSupervisor = () => {
  if (!existsSync(pidFile)) {
    console.log("No supervisor pid file — nothing to stop.");
    return;
  }

  const pid = Number(readFileSync(pidFile, "utf8").trim());
  if (!Number.isFinite(pid)) {
    unlinkSync(pidFile);
    return;
  }

  try {
    process.kill(pid, "SIGTERM");
    console.log(`Stopped supervisor pid ${pid}`);
  } catch {
    console.log(`Supervisor pid ${pid} already gone`);
  }

  try {
    unlinkSync(pidFile);
  } catch {
    // The supervisor may have removed it already.
  }

  for (const site of sites) freePort(site.port);
};

if (process.argv.includes("--stop")) {
  stopSupervisor();
  process.exit(0);
}

writeFileSync(pidFile, String(process.pid));
log(`supervisor start pid=${process.pid}`);
log(`business  → ${sites[0].url}`);
log(`creative  → ${sites[1].url}`);
log(`log file  → ${logFile}`);

const startSite = (site) => {
  if (shuttingDown) return;
  freePort(site.port);

  const child = spawn("npm", site.npmArgs, {
    cwd: site.cwd,
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  children.set(site.name, child);
  log(`${site.name}: spawned pid=${child.pid}`);

  const prefix = (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim()) log(`${site.name}| ${line}`);
    }
  };

  child.stdout?.on("data", prefix);
  child.stderr?.on("data", prefix);

  child.on("exit", (code, signal) => {
    children.delete(site.name);
    if (shuttingDown) return;
    log(
      `${site.name}: exited code=${code} signal=${signal} — restart in ${restartDelayMs}ms`
    );
    setTimeout(() => startSite(site), restartDelayMs);
  });
};

const shutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  log(`shutdown (${signal})`);

  for (const child of children.values()) {
    try {
      child.kill("SIGTERM");
    } catch {
      // The child may already be gone.
    }
  }

  for (const site of sites) freePort(site.port);

  try {
    unlinkSync(pidFile);
  } catch {
    // The file may already be gone.
  }

  setTimeout(() => process.exit(0), 400);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

for (const site of sites) startSite(site);
