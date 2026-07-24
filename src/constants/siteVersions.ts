/** Creative (wow) uses Vite basicSsl — must be https in local pair. */
const DEV_CREATIVE_URL = "https://127.0.0.1:5174/";
/** Default production Creative host until a custom domain is wired. */
const PROD_CREATIVE_URL = "https://portfolio-wow.vercel.app/";

const withTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

/** Sibling Creative (wow) site. Override with VITE_CREATIVE_URL when deployed. */
export const getCreativeUrl = (): string => {
  const fromEnv = import.meta.env.VITE_CREATIVE_URL?.trim();
  if (fromEnv) return withTrailingSlash(fromEnv);
  return import.meta.env.DEV ? DEV_CREATIVE_URL : PROD_CREATIVE_URL;
};
