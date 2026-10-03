const isAbsoluteUrl = (path: string) =>
  /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith("data:");

export const withBase = (path: string) => {
  if (isAbsoluteUrl(path)) {
    return path;
  }
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
};
