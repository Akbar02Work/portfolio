#!/usr/bin/env node
/**
 * Rebuild the frozen pre-redesign site into public/old.
 *
 * Usage:
 *   npm run archive:old
 *   npm run archive:old -- <commitSha>
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frozenSnapshotRef = "c148376";
const ref = process.argv[2] || frozenSnapshotRef;
// Resolve a commit before creating or deleting anything. Refs are arguments, never shell code.
const commit = execFileSync("git", ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`], {
  cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"],
}).trim();
const worktree = mkdtempSync(path.join(os.tmpdir(), "portfolio-old-"));
const dest = path.join(root, "public", "old");
let worktreeAdded = false;

const run = (command, args, cwd = root, env = {}) => {
  execFileSync(command, args, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
};

console.log(`Archiving ${commit} → public/old (base /old/)`);
try {
  run("git", ["worktree", "add", "--detach", worktree, commit]);
  worktreeAdded = true;
  run("npm", ["ci"], worktree);
  run("npm", ["run", "build"], worktree, { VITE_BASE_URL: "/old/" });

  rmSync(dest, { recursive: true, force: true });
  mkdirSync(path.dirname(dest), { recursive: true });
  const output = path.join(worktree, "dist");
  // These copied assets are unused in the frozen snapshot. Preserve other refs.
  const excludedFiles = new Set(
    (commit.startsWith(frozenSnapshotRef) ? [
      "sitemap.xml",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "projects/money-manager/placeholder.png",
      "projects/quiz-learnwords/placeholder.png",
      "projects/loyalist/placeholder.png",
    ] : []).map((file) => path.join(output, file))
  );
  cpSync(output, dest, {
    recursive: true,
    filter: (source) => !excludedFiles.has(source),
  });

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
      )
      .replace("</head>", '  <link rel="stylesheet" href="/styles/archive-return.css" />\n</head>')
      .replace("</body>", '  <a class="archive-return" href="/">← Return to the current portfolio</a>\n</body>');
    writeFileSync(indexPath, html);
  }

  console.log(`Done: ${dest}`);
} finally {
  if (worktreeAdded) {
    run("git", ["worktree", "remove", "--force", worktree]);
  } else {
    rmSync(worktree, { recursive: true, force: true });
  }
}
