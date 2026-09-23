import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { rememberLocale, useI18n } from "@/i18n/useI18n";
import { LOCALES, localizePath, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "En", full: "English" },
  ru: { short: "Ru", full: "Русский" },
};

/** Segment width (w-9) plus the gap between segments (gap-0.5), in px. */
const SEGMENT = 36;
const GAP = 2;
const STEP = SEGMENT + GAP;
const MAX_X = STEP * (LOCALES.length - 1);
const DRAG_THRESHOLD = 4;

const clamp = (value: number) => Math.min(MAX_X, Math.max(0, value));

type LanguageSwitchProps = {
  className?: string;
  onSwitch?: () => void;
};

/**
 * EN / RU segmented switch. The highlight can be grabbed and slid between the
 * segments like an iOS segmented control (hard-bounded to the track); on
 * release it snaps to the nearest language and applies it. Plain clicks and
 * keyboard use regular links.
 */
export const LanguageSwitch = ({ className, onSwitch }: LanguageSwitchProps) => {
  const { locale, t } = useI18n();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const activeIndex = LOCALES.indexOf(locale);

  const [pressed, setPressed] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const gestureRef = useRef<{
    pointerId: number;
    startX: number;
    thumbX: number;
    dragging: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const targetPath = (target: Locale) => localizePath(`${pathname}${search}${hash}`, target);

  const commit = (target: Locale) => {
    if (target === locale) return;
    rememberLocale(target);
    navigate(targetPath(target));
    onSwitch?.();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      thumbX: activeIndex * STEP,
      dragging: false,
    };
    setPressed(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;

    if (!gesture.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      gesture.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setDragX(clamp(gesture.thumbX + dx));
  };

  const endGesture = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    setPressed(false);

    if (gesture.dragging) {
      suppressClickRef.current = true;
      const x = dragX ?? gesture.thumbX;
      setDragX(null);
      if (!cancelled) {
        const index = Math.round(clamp(x) / STEP);
        const target = LOCALES[index];
        if (target) commit(target);
      }
    }
  };

  const dragging = dragX !== null;
  const thumbX = dragging ? dragX : activeIndex * STEP;
  const visualIndex = Math.round(thumbX / STEP);

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => endGesture(event, false)}
      onPointerCancel={(event) => endGesture(event, true)}
      onClickCapture={(event) => {
        if (!suppressClickRef.current) return;
        suppressClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-lg border border-gray-200/90 dark:border-gray-800/90 bg-gray-50/80 dark:bg-slate-900/60 p-0.5",
        "font-mono text-[0.65rem] uppercase tracking-[0.12em] select-none touch-pan-y",
        pressed && "cursor-grabbing",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0.5 top-0.5 bottom-0.5 w-9 rounded-md bg-white dark:bg-black shadow-sm shadow-black/5",
          dragging
            ? "transition-none"
            : "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        )}
        style={{ transform: `translate3d(${thumbX}px, 0, 0)` }}
      />
      {LOCALES.map((target, index) => {
        const isActive = target === locale;
        const isVisual = index === visualIndex;
        const label = LABELS[target];
        const labelClass = cn(
          "relative z-10 flex w-9 items-center justify-center rounded-md py-1.5 transition-colors",
          isVisual ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white",
          !isActive && "cursor-pointer"
        );
        return isActive ? (
          <span key={target} aria-current="true" lang={target} title={label.full} className={labelClass}>
            {label.short}
          </span>
        ) : (
          <Link
            key={target}
            to={targetPath(target)}
            hrefLang={target}
            lang={target}
            title={label.full}
            aria-label={label.full}
            draggable={false}
            onClick={() => {
              rememberLocale(target);
              onSwitch?.();
            }}
            className={cn(labelClass, "focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt")}
          >
            {label.short}
          </Link>
        );
      })}
    </div>
  );
};
