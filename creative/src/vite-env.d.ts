/// <reference types="vite/client" />

declare const __PUBLIC_PROJECT_SLUGS__: readonly string[];

interface ImportMetaEnv {
  /** Production/local URL of the Business portfolio */
  readonly VITE_BUSINESS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
