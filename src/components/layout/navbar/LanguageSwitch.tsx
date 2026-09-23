import { Link, useLocation } from "react-router-dom";
import { rememberLocale, useI18n } from "@/i18n/useI18n";
import { LOCALES, localizePath, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "En", full: "English" },
  ru: { short: "Ru", full: "Русский" },
};

type LanguageSwitchProps = {
  className?: string;
  onSwitch?: () => void;
};

export const LanguageSwitch = ({ className, onSwitch }: LanguageSwitchProps) => {
  const { locale, t } = useI18n();
  const { pathname, search, hash } = useLocation();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-gray-200/90 dark:border-gray-800/90 bg-gray-50/80 dark:bg-slate-900/60 p-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]",
        className
      )}
    >
      {LOCALES.map((target) => {
        const isActive = target === locale;
        const label = LABELS[target];
        return isActive ? (
          <span
            key={target}
            aria-current="true"
            lang={target}
            title={label.full}
            className="px-2.5 py-1.5 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white font-semibold shadow-sm shadow-black/5"
          >
            {label.short}
          </span>
        ) : (
          <Link
            key={target}
            to={localizePath(`${pathname}${search}${hash}`, target)}
            hrefLang={target}
            lang={target}
            title={label.full}
            aria-label={label.full}
            preventScrollReset
            onClick={() => {
              rememberLocale(target);
              onSwitch?.();
            }}
            className="px-2.5 py-1.5 rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {label.short}
          </Link>
        );
      })}
    </div>
  );
};
