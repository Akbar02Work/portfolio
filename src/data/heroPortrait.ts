export const HERO_PORTRAIT_SIZES = "(min-width: 1024px) 400px, (min-width: 768px) 40vw, 80vw";

export const heroPortraitSrcSet = (format: "png" | "webp", base = "/") =>
  [320, 480, 586].map((width) =>
    `${base}avatar${width === 586 ? "" : `-${width}`}.${format} ${width}w`
  ).join(", ");
