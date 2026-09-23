/**
 * React 18 sets image attributes before attaching the node to its <picture>.
 * WebKit can fetch fallback URLs at that point. Keep loading="lazy" first in
 * JSX, then promote priority images synchronously on attachment, before paint.
 */
export const eagerPictureRef = (image: HTMLImageElement | null) => {
  if (image) image.loading = "eager";
};
