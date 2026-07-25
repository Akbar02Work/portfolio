import { readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDirectory = path.resolve(process.cwd(), "public");
const rasterExtensions = new Set([".png", ".jpg", ".jpeg"]);
const excludedFileNames = new Set([
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "apple-touch-icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "og-image.png",
  "android-phone-frame.png",
]);

const formatBytes = (bytes: number): string => `${(bytes / 1024).toFixed(1)} KB`;

const collectRasterImages = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // Skip frozen archives — rebuilt via dedicated scripts
      if (
        (entry.name === "old" || entry.name === "creative") &&
        path.resolve(directory) === publicDirectory
      ) {
        continue;
      }
      images.push(...await collectRasterImages(absolutePath));
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (rasterExtensions.has(extension) && !excludedFileNames.has(entry.name)) {
      images.push(absolutePath);
    }
  }

  return images.sort();
};

const optimizeImage = async (sourcePath: string): Promise<void> => {
  const extension = path.extname(sourcePath);
  const outputBase = sourcePath.slice(0, -extension.length);
  const webpPath = `${outputBase}.webp`;
  const avifPath = `${outputBase}.avif`;
  const source = sharp(sourcePath).rotate();
  const shouldGenerateAvif = !path.basename(sourcePath).startsWith("avatar");

  const [webpBuffer, avifBuffer, sourceStats] = await Promise.all([
    source.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toBuffer(),
    shouldGenerateAvif
      ? source.clone().avif({ quality: 55, effort: 6, chromaSubsampling: "4:4:4" }).toBuffer()
      : Promise.resolve(null),
    stat(sourcePath),
  ]);

  await writeFile(webpPath, webpBuffer);

  const relativeSource = path.relative(process.cwd(), sourcePath);
  const sizes = [
    `source ${formatBytes(sourceStats.size)}`,
    `webp ${formatBytes(webpBuffer.length)}`,
  ];

  if (avifBuffer && avifBuffer.length < webpBuffer.length) {
    await writeFile(avifPath, avifBuffer);
    sizes.push(`avif ${formatBytes(avifBuffer.length)}`);
  } else {
    await rm(avifPath, { force: true });
    sizes.push(
      shouldGenerateAvif
        ? "avif skipped (not smaller than webp)"
        : "avif skipped for portrait quality"
    );
  }

  console.log(`${relativeSource}: ${sizes.join(", ")}`);
};

const images = await collectRasterImages(publicDirectory);

if (images.length === 0) {
  console.log("No raster images found to optimize.");
} else {
  for (const image of images) {
    await optimizeImage(image);
  }
  console.log(`Optimized ${images.length} raster images; original files preserved.`);
}
