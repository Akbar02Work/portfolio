import { withBase } from "@/lib/urls";

/** Creative (wow) local pair — HTTPS via Vite basicSsl. */
const DEV_CREATIVE_URL = "https://127.0.0.1:5174/";
/** Creative ships under the Business host at /creative. */
const PROD_CREATIVE_URL = "/creative/";

/** Enter Creative with its full intro. Override with VITE_CREATIVE_URL when needed. */
export const getCreativeUrl = (): string => {
  const fromEnv = import.meta.env.VITE_CREATIVE_URL?.trim();
  const destination = new URL(
    fromEnv || (import.meta.env.DEV ? DEV_CREATIVE_URL : PROD_CREATIVE_URL),
    window.location.origin,
  );
  if (!destination.pathname.endsWith("/")) destination.pathname += "/";
  destination.searchParams.set("intro", "1");
  return destination.href;
};

/** Frozen portfolio archive served alongside Business. */
export const getOldUrl = (): string => withBase("old/");
