const ALLOWED_DOMAINS = [
  "github.com",
  "linkedin.com",
  "www.linkedin.com",
  "t.me",
  "lumingo.me",
];

export const isAllowedExternalUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;

    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(
      (domain) =>
        hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};
