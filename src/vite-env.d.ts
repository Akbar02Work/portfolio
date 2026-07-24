/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __GIT_COMMIT_SHA__: string;

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string;
  /** Production/local URL of the Creative (wow) portfolio */
  readonly VITE_CREATIVE_URL?: string;
}
