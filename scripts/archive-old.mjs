#!/usr/bin/env node
/**
 * Rebuild the frozen pre-redesign site into public/old.
 *
 * Usage:
 *   npm run archive:old
 *   npm run archive:old -- <commitSha>
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
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const commit = process.argv[2] || "c148376";
const worktree = path.join(os.tmpdir(), `portfolio-old-${commit}`);
const dest = path.join(root, "public", "old");

const run = (command, cwd = root, env) => {
  console.log(`$ ${command}`);
  execSync(command, { cwd, stdio: "inherit", env: env ? { ...process.env, ...env } : process.env });
};

console.log(`Archiving ${commit} → public/old (base /old/)`);

try {
  run(`git worktree remove --force "${worktree}"`);
} catch {
  /* no existing worktree */
}
rmSync(worktree, { recursive: true, force: true });
run(`git worktree add "${worktree}" ${commit}`);
run("npm ci", worktree);
run("npm run build", worktree, { VITE_BASE_URL: "/old/" });

rmSync(dest, { recursive: true, force: true });
mkdirSync(path.dirname(dest), { recursive: true });
cpSync(path.join(worktree, "dist"), dest, { recursive: true });

writeFileSync(
  path.join(dest, "robots.txt"),
  "User-agent: *\nDisallow: /\n"
);

writeFileSync(
  path.join(dest, "ARCHIVE.txt"),
  `Frozen snapshot of portfolio @ ${commit}\nBuilt with VITE_BASE_URL=/old/\nRebuild: npm run archive:old\n`
);

const indexPath = path.join(dest, "index.html");
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, "utf8");
  if (!html.includes('name="robots"')) {
    html = html.replace(
      "<head>",
      '<head>\n  <meta name="robots" content="noindex, nofollow" />'
    );
  }
  html = html
    .replaceAll(
      'content="https://www.akbar02work.xyz/"',
      'content="https://www.akbar02work.xyz/old/"'
    )
    .replaceAll(
      'content="https://www.akbar02work.xyz/og-image.png"',
      'content="https://www.akbar02work.xyz/old/og-image.png"'
    );
  writeFileSync(indexPath, html);
}

try {
  run(`git worktree remove --force "${worktree}"`);
} catch {
  rmSync(worktree, { recursive: true, force: true });
}

console.log(`Done: ${dest}`);
