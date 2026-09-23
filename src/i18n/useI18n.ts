import { createContext, useContext } from "react";
import { storage } from "@/lib/storage";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from "./locales";
import { messages, type Messages } from "./messages";

export type I18nValue = {
  locale: Locale;
  t: Messages;
  /** Prefixes an app path with the active locale. */
  localize: (path: string) => string;
};

export const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  t: messages[DEFAULT_LOCALE],
  localize: (path) => path,
});

export const useI18n = () => useContext(I18nContext);

/** Persists an explicit choice made in the language switch. */
export const rememberLocale = (locale: Locale) => {
  storage.setString(LOCALE_STORAGE_KEY, locale);
};
