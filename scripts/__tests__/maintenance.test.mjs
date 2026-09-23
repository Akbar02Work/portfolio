import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fixturesRoot = path.join(root, "test-results");
mkdirSync(fixturesRoot, { recursive: true });
const fixture = () => {
  const directory = mkdtempSync(path.join(fixturesRoot, "dev-"));
  mkdirSync(path.join(directory, "scripts"));
  mkdirSync(path.join(directory, "creative"));
  return directory;
};
const listen = async () => {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server;
};
const run = (script, args = []) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [script, ...args], { stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  child.on("error", reject);
  child.on("exit", (code) => resolve({ code, output }));
});

test("dev supervisor preserves occupied ports and ignores a stale PID on stop", { timeout: 10_000 }, async () => {
  const listener = await listen();
  const port = listener.address().port;
  const directory = fixture();
  const script = path.join(directory, "scripts/dev-portfolios.mjs");
  writeFileSync(script, readFileSync(path.join(root, "scripts/dev-portfolios.mjs"), "utf8").replaceAll("5173", String(port)));
  writeFileSync(path.join(directory, ".dev-portfolios.pid"), String(process.pid));
  try {
    const start = await run(script);
    assert.equal(start.code, 1, start.output);
    assert.match(start.output, /occupied/);
    assert.equal(listener.listening, true);
    const stop = await run(script, ["--stop"]);
    assert.equal(stop.code, 0, stop.output);
    assert.match(stop.output, /No managed supervisor/);
    assert.equal(listener.listening, true);
  } finally {
    listener.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("archive rejects shell syntax as a ref before writing anything", () => {
  const marker = path.join(fixturesRoot, "archive-shell-marker");
  const result = spawnSync(process.execPath, [path.join(root, "scripts/archive-old.mjs"), `HEAD; touch '${marker}'; #`], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(marker), false);
});

test("dev supervisor stops both owned process groups through its checkout socket", { timeout: 15_000 }, async () => {
  const reservations = await Promise.all([listen(), listen()]);
  const ports = reservations.map((server) => server.address().port);
  for (const server of reservations) await new Promise((resolve) => server.close(resolve));
  const directory = fixture();
  const script = path.join(directory, "scripts/dev-portfolios.mjs");
  writeFileSync(script, readFileSync(path.join(root, "scripts/dev-portfolios.mjs"), "utf8")
    .replaceAll("5173", String(ports[0])).replaceAll("5174", String(ports[1])));
  for (const app of [directory, path.join(directory, "creative")]) {
    writeFileSync(path.join(app, "package.json"), JSON.stringify({ scripts: { dev: "node dev.cjs" } }));
    writeFileSync(path.join(app, "dev.cjs"), `const server = require('node:net').createServer();
      server.listen(Number(process.argv[process.argv.indexOf('--port') + 1]), '127.0.0.1', () => console.log('fixture-ready'));
      process.on('SIGTERM', () => server.close());`);
  }
  const supervisor = spawn(process.execPath, [script], { stdio: ["ignore", "pipe", "pipe"] });
  const exited = once(supervisor, "exit");
  try {
    await new Promise((resolve, reject) => {
      let output = "";
      const timer = setTimeout(() => reject(new Error(`Supervisor failed to start: ${output}`)), 8000);
      const read = (chunk) => {
        output += chunk;
        if (output.includes("business| fixture-ready") && output.includes("creative| fixture-ready")) {
          clearTimeout(timer);
          resolve();
        }
      };
      supervisor.stdout.on("data", read);
      supervisor.stderr.on("data", read);
    });
    const duplicate = await run(script);
    assert.equal(duplicate.code, 1, duplicate.output);
    assert.match(duplicate.output, /already has a running supervisor/);
    const stopped = await run(script, ["--stop"]);
    assert.equal(stopped.code, 0, stopped.output);
    assert.equal((await exited)[0], 0);
    for (const port of ports) {
      const probe = createServer();
      probe.listen(port, "127.0.0.1");
      await once(probe, "listening");
      await new Promise((resolve) => probe.close(resolve));
    }
  } finally {
    if (supervisor.exitCode === null) {
      supervisor.kill("SIGTERM");
      await exited;
    }
    rmSync(directory, { recursive: true, force: true });
  }
});

test("Creative check detects added or changed embed files without overwriting them", { timeout: 15_000 }, async () => {
  const directory = fixture();
  const script = path.join(directory, "scripts/embed-creative.mjs");
  writeFileSync(script, readFileSync(path.join(root, "scripts/embed-creative.mjs")));
  const creative = path.join(directory, "creative");
  mkdirSync(path.join(creative, "node_modules/.bin"), { recursive: true });
  writeFileSync(path.join(creative, "node_modules/.bin/tsc"), "");
  writeFileSync(path.join(creative, "package.json"), JSON.stringify({ scripts: { build: "node build.cjs" } }));
  writeFileSync(path.join(creative, "build.cjs"), `const fs = require('node:fs'); fs.mkdirSync('dist', { recursive: true }); fs.writeFileSync('dist/index.html', 'fresh');`);
  const embed = path.join(directory, "public/creative");
  mkdirSync(embed, { recursive: true });
  writeFileSync(path.join(embed, "index.html"), "stale");
  try {
    assert.equal((await run(script, ["--check"])).code, 1);
    assert.equal(readFileSync(path.join(embed, "index.html"), "utf8"), "stale");
    assert.equal((await run(script)).code, 0);
    assert.equal((await run(script, ["--check"])).code, 0);
    writeFileSync(path.join(embed, "untracked.js"), "extra");
    assert.equal((await run(script, ["--check"])).code, 1);
    assert.equal(existsSync(path.join(embed, "untracked.js")), true);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
