#!/usr/bin/env node
/**
 * Embed Creative (portfolio-wow) into Business at public/creative.
 *
 * Usage:
 *   npm run embed:creative
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wowRoot = path.join(root, "creative");
const dest = path.join(root, "public", "creative");

if (!existsSync(wowRoot)) {
  console.error(`Missing Creative app at ${wowRoot}`);
  process.exit(1);
}

const creativeBuildTool = path.join(wowRoot, "node_modules", ".bin", "tsc");
if (!existsSync(creativeBuildTool)) {
  console.log("Creative dependencies are missing; installing from package-lock.json …");
  execSync("npm ci", {
    cwd: wowRoot,
    stdio: "inherit",
  });
}

console.log("Building Creative with base /creative/ …");
execSync("npm run build", {
  cwd: wowRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    VITE_BASE_URL: "/creative/",
    VITE_BUSINESS_URL: "https://www.akbar02work.xyz/",
  },
});

rmSync(dest, { recursive: true, force: true });
mkdirSync(path.dirname(dest), { recursive: true });
cpSync(path.join(wowRoot, "dist"), dest, { recursive: true });

writeFileSync(
  path.join(dest, "ARCHIVE.txt"),
  "Creative (portfolio-wow) embedded with VITE_BASE_URL=/creative/\nRebuild: npm run embed:creative\n"
);

const indexPath = path.join(dest, "index.html");
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, "utf8");
  html = html
    .replaceAll(
      'href="https://www.akbar02work.xyz/"',
      'href="https://www.akbar02work.xyz/creative/"'
    )
    .replaceAll(
      'content="https://www.akbar02work.xyz/"',
      'content="https://www.akbar02work.xyz/creative/"'
    );
  if (!html.includes('property="og:url"')) {
    html = html.replace(
      '<meta property="og:type" content="website" />',
      '<meta property="og:type" content="website" />\n    <meta property="og:url" content="https://www.akbar02work.xyz/creative/" />'
    );
  }
  writeFileSync(indexPath, html);
}

console.log(`Done: ${dest}`);
