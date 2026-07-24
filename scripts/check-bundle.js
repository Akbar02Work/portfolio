import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const MAX_INITIAL_PAYLOAD_KB = Number(
  process.env.MAX_BUNDLE_SIZE_KB ?? 150
);
const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");
const assetsDir = path.join(distDir, "assets");

if (!Number.isFinite(MAX_INITIAL_PAYLOAD_KB) || MAX_INITIAL_PAYLOAD_KB <= 0) {
  console.error("MAX_BUNDLE_SIZE_KB must be a positive number.");
  process.exit(1);
}

if (!existsSync(indexPath)) {
  console.error(`Missing build output: ${indexPath}`);
  console.error("Run `npm run build` before `npm run check:bundle`.");
  process.exit(1);
}

const indexHtml = readFileSync(indexPath, "utf8");
const assetReferences = Array.from(
  indexHtml.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g),
  (match) => match[1]
);
const initialAssetFiles = [
  ...new Set(
    assetReferences
      .filter((reference) => /\/assets\/.*\.(?:js|css)(?:\?.*)?$/.test(reference))
      .map((reference) => reference.split("/assets/")[1]?.split("?")[0])
      .filter(Boolean)
  ),
];

if (initialAssetFiles.length === 0) {
  console.error("No initial JavaScript or CSS assets found in dist/index.html.");
  process.exit(1);
}

const initialAssets = initialAssetFiles.map((file) => {
  const filePath = path.join(assetsDir, file);
  if (!existsSync(filePath)) {
    console.error(`Missing initial asset referenced by dist/index.html: ${file}`);
    process.exit(1);
  }

  const contents = readFileSync(filePath);
  return {
    file,
    rawSizeKb: contents.byteLength / 1024,
    gzipSizeKb: gzipSync(contents).byteLength / 1024,
  };
});

const initialPayloadKb = initialAssets.reduce(
  (total, asset) => total + asset.gzipSizeKb,
  0
);

console.log("Initial payload assets (raw / gzip):");
for (const asset of initialAssets) {
  console.log(
    ` - ${asset.file}: ${asset.rawSizeKb.toFixed(2)} KB / ${asset.gzipSizeKb.toFixed(2)} KB`
  );
}
console.log(`Total initial payload (gzip): ${initialPayloadKb.toFixed(2)} KB`);

if (initialPayloadKb > MAX_INITIAL_PAYLOAD_KB) {
  console.error(
    `\nInitial payload budget exceeded: ${initialPayloadKb.toFixed(2)} KB > ${MAX_INITIAL_PAYLOAD_KB.toFixed(2)} KB.`
  );
  process.exit(1);
}

console.log(
  `\nInitial payload budget OK: ${initialPayloadKb.toFixed(2)} KB <= ${MAX_INITIAL_PAYLOAD_KB.toFixed(2)} KB.`
);
