/** Creative (wow) local pair — HTTPS via Vite basicSsl. */
const DEV_CREATIVE_URL = "https://127.0.0.1:5174/";
/** Creative ships under the Business host at /creative. */
const PROD_CREATIVE_URL = "https://www.akbar02work.xyz/creative/";

const withTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

/** Sibling Creative (wow) site. Override with VITE_CREATIVE_URL when needed. */
export const getCreativeUrl = (): string => {
  const fromEnv = import.meta.env.VITE_CREATIVE_URL?.trim();
  if (fromEnv) return withTrailingSlash(fromEnv);
  return import.meta.env.DEV ? DEV_CREATIVE_URL : PROD_CREATIVE_URL;
};
