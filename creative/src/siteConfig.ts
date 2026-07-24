const DEV_BUSINESS_URL = "http://127.0.0.1:5173/";
const PROD_BUSINESS_URL = "https://www.akbar02work.xyz/";

export function getBusinessUrl(): string {
  const fromEnv = import.meta.env.VITE_BUSINESS_URL?.trim();
  if (fromEnv) return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  if (import.meta.env.DEV) return DEV_BUSINESS_URL;
  return PROD_BUSINESS_URL;
}

