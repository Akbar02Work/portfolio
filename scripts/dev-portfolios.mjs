#!/usr/bin/env node
/** Keep the two dev servers alive; stop only processes owned by this supervisor. */
import { spawn } from "node:child_process";
import { createConnection, createServer } from "node:net";
import { lstatSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pidFile = path.join(root, ".dev-portfolios.pid");
const socketPath = path.join(root, ".dev-portfolios.sock");
const logFile = path.join(root, ".dev-portfolios.log");
const sites = [
  { name: "business", cwd: root, port: 5173, url: "http://127.0.0.1:5173/" },
  { name: "creative", cwd: path.join(root, "creative"), port: 5174, url: "https://127.0.0.1:5174/" },
];
const children = new Map();
const restartTimers = new Set();
let shuttingDown = false;
let ownsPidFile = false;

const log = (message) => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  try { writeFileSync(logFile, line, { flag: "a" }); } catch { /* Optional log. */ }
};

// The socket belongs to this checkout. A stale/reused PID can never kill another app.
const contactSupervisor = (command) => new Promise((resolve, reject) => {
  const socket = createConnection(socketPath);
  socket.setTimeout(1000, () => socket.destroy(new Error("Supervisor did not respond")));
  socket.on("connect", () => socket.end(command));
  socket.on("data", () => resolve(true));
  socket.on("error", (error) => {
    if (error.code === "ENOENT" || error.code === "ECONNREFUSED") resolve(false);
    else reject(error);
  });
  socket.on("end", () => resolve(true));
});

const killOwnedChild = (child) => {
  if (!child.pid) return;
  try {
    // npm spawns Vite, so terminate the process group created for this child.
    process.kill(-child.pid, "SIGTERM");
  } catch (error) {
    if (error.code !== "ESRCH") log(`Could not stop owned child: ${error.message}`);
  }
};

const control = createServer((socket) => {
  socket.setEncoding("utf8");
  let command = "";
  socket.on("data", (chunk) => { command += chunk; });
  socket.on("end", () => {
    socket.end("ok");
    if (command === "stop") shutdown("stop command");
  });
});

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  log(`shutdown (${signal})`);
  for (const timer of restartTimers) clearTimeout(timer);
  for (const child of children.values()) killOwnedChild(child);
  if (control.listening) control.close();
  if (ownsPidFile) {
    try { unlinkSync(pidFile); } catch { /* Already removed. */ }
  }
}

const startSite = (site) => {
  if (shuttingDown) return;
  const child = spawn("npm", ["run", "dev", "--", "--port", String(site.port), "--strictPort", "--host"], {
    cwd: site.cwd,
    env: { ...process.env, FORCE_COLOR: "1" },
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.set(site.name, child);
  log(`${site.name}: spawned pid=${child.pid} → ${site.url}`);
  const prefix = (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) if (line.trim()) log(`${site.name}| ${line}`);
  };
  child.stdout.on("data", prefix);
  child.stderr.on("data", prefix);
  child.on("error", (error) => {
    log(`${site.name}: ${error.message}`);
    process.exitCode = 1;
    shutdown("spawn failed");
  });
  child.on("exit", (code, signal) => {
    killOwnedChild(child);
    children.delete(site.name);
    if (shuttingDown) return;
    log(`${site.name}: exited code=${code} signal=${signal} — restart in 1200ms`);
    const timer = setTimeout(() => {
      restartTimers.delete(timer);
      startSite(site);
    }, 1200);
    restartTimers.add(timer);
  });
};

try {
  if (process.argv.includes("--stop")) {
    console.log(await contactSupervisor("stop") ? "Stopped this checkout's supervisor." : "No managed supervisor is running.");
  } else {
    if (await contactSupervisor("ping")) throw new Error("This checkout already has a running supervisor.");
    try {
      if (lstatSync(socketPath).isSocket()) unlinkSync(socketPath);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    await new Promise((resolve, reject) => {
      control.once("error", reject);
      control.listen(socketPath, resolve);
    });
    // Never free an occupied port by killing its listener.
    for (const site of sites) {
      await new Promise((resolve, reject) => {
        const probe = createServer();
        probe.once("error", () => reject(new Error(`Port ${site.port} is occupied; its process was left running.`)));
        probe.listen(site.port, () => probe.close(resolve));
      });
    }
    writeFileSync(pidFile, String(process.pid));
    ownsPidFile = true;
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    for (const site of sites) startSite(site);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
  shutdown("startup failed");
}
