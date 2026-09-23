import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  localeFromPath,
  localizePath,
} from "./locales";
import { messages } from "./messages";
import { I18nContext, type I18nValue } from "./useI18n";

/** Paths that exist only in English (no localized twin). */
const UNLOCALIZED_PATHS = ["/easter"];

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(pathname);
  const checkedStoredChoiceRef = useRef(false);

  // An explicit earlier choice of Russian is honoured once, on the first page
  // of a visit. Browser language alone never redirects.
  useEffect(() => {
    if (checkedStoredChoiceRef.current) return;
    checkedStoredChoiceRef.current = true;
    if (locale !== DEFAULT_LOCALE || UNLOCALIZED_PATHS.includes(pathname)) return;
    const stored = storage.getString(LOCALE_STORAGE_KEY);
    if (isLocale(stored) && stored !== DEFAULT_LOCALE) {
      navigate(localizePath(`${pathname}${search}${hash}`, stored), { replace: true });
    }
  }, [hash, locale, navigate, pathname, search]);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      t: messages[locale],
      localize: (path) => localizePath(path, locale),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
