#!/usr/bin/env node
/** Build or verify the Creative embed without depending on the Git index. */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const creative = path.join(root, "creative");
const output = path.join(creative, "dist");
const destination = path.join(root, "public", "creative");
const check = process.argv.includes("--check");

// On Windows `npm` is a .cmd shim that execFileSync cannot start directly.
// Under `npm run`, npm_execpath points at npm's JS entry, so run it with Node.
const npm = (args, options) => {
  const npmCli = process.env.npm_execpath;
  if (npmCli && /\.[cm]?js$/i.test(npmCli)) {
    return execFileSync(process.execPath, [npmCli, ...args], options);
  }
  // Arguments are fixed literals, so the Windows shell fallback is safe.
  return execFileSync("npm", args, { ...options, shell: process.platform === "win32" });
};

if (!existsSync(path.join(creative, "node_modules", ".bin", "tsc"))) {
  console.log("Installing Creative dependencies from its lockfile …");
  npm(["ci"], { cwd: creative, stdio: "inherit" });
}

npm(["run", "build"], {
  cwd: creative,
  stdio: "inherit",
  env: { ...process.env, VITE_BASE_URL: "/creative/", VITE_BUSINESS_URL: "/" },
});
writeFileSync(
  path.join(output, "ARCHIVE.txt"),
  "Creative (portfolio-wow) embedded with VITE_BASE_URL=/creative/\nRebuild: npm run embed:creative\n",
);

const files = (directory, prefix = "") => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(prefix, entry.name);
    return entry.isDirectory() ? files(path.join(directory, entry.name), name) : [name];
  }).sort();
};

if (check) {
  const expected = files(output);
  const actual = files(destination);
  const differences = [...new Set([...expected, ...actual])].filter((name) =>
    !expected.includes(name) || !actual.includes(name) ||
    !readFileSync(path.join(output, name)).equals(readFileSync(path.join(destination, name)))
  );
  if (differences.length) {
    console.error(`Creative embed is stale (${differences.length} files). Run npm run build:creative.`);
    process.exitCode = 1;
  } else {
    console.log("Creative embed matches the source build byte for byte.");
  }
} else {
  // Copy only after a successful build; failed compilation preserves the last embed.
  rmSync(destination, { recursive: true, force: true });
  cpSync(output, destination, { recursive: true });
  console.log(`Embedded Creative at ${destination}`);
}
