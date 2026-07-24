/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Production/local URL of the Business portfolio */
  readonly VITE_BUSINESS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
