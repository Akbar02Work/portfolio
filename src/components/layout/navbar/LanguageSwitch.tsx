import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { rememberLocale, useI18n } from "@/i18n/useI18n";
import { LOCALES, localizePath, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "En", full: "English" },
  ru: { short: "Ru", full: "Русский" },
};

/** Segment width in px (matches w-10). */
const SEGMENT = 40;
const MAX_X = SEGMENT * (LOCALES.length - 1);
const DRAG_THRESHOLD = 4;

type DragState = {
  x: number;
  /** Horizontal stretch from drag velocity (liquid feel). */
  stretch: number;
};

type LanguageSwitchProps = {
  className?: string;
  onSwitch?: () => void;
};

/**
 * EN / RU segmented switch with a draggable glass thumb: press and slide it
 * like an iOS liquid-glass control; on release it snaps to the nearest
 * language and applies it. Plain clicks and keyboard use regular links.
 */
export const LanguageSwitch = ({ className, onSwitch }: LanguageSwitchProps) => {
  const { locale, t } = useI18n();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const activeIndex = LOCALES.indexOf(locale);

  const [pressed, setPressed] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const gestureRef = useRef<{
    pointerId: number;
    startX: number;
    thumbX: number;
    lastX: number;
    lastT: number;
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
    const now = performance.now();
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      thumbX: activeIndex * SEGMENT,
      lastX: event.clientX,
      lastT: now,
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

    const now = performance.now();
    const velocity = (event.clientX - gesture.lastX) / Math.max(1, now - gesture.lastT);
    gesture.lastX = event.clientX;
    gesture.lastT = now;

    const raw = gesture.thumbX + dx;
    // Soft resistance past the ends, like a rubber band.
    const x = raw < 0 ? raw * 0.25 : raw > MAX_X ? MAX_X + (raw - MAX_X) * 0.25 : raw;
    setDrag({ x, stretch: Math.min(0.28, Math.abs(velocity) * 0.18) });
  };

  const endGesture = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    setPressed(false);

    if (gesture.dragging) {
      suppressClickRef.current = true;
      const x = drag?.x ?? gesture.thumbX;
      setDrag(null);
      if (!cancelled) {
        const index = Math.round(Math.min(MAX_X, Math.max(0, x)) / SEGMENT);
        const target = LOCALES[index];
        if (target) commit(target);
      }
    }
  };

  const thumbX = drag ? drag.x : activeIndex * SEGMENT;
  const stretch = drag?.stretch ?? 0;
  const lift = pressed ? 1.06 : 1;
  const progress = Math.min(1, Math.max(0, thumbX / SEGMENT));
  const visualIndex = Math.round(progress * (LOCALES.length - 1));

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
        "relative inline-flex items-center rounded-full p-[3px] select-none touch-pan-y",
        "border border-gray-200/90 dark:border-gray-800/90 bg-gray-100/70 dark:bg-slate-900/60",
        pressed ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-[3px] top-[3px] h-7 w-10 rounded-full",
          "bg-white/75 dark:bg-white/[0.14] backdrop-blur-md",
          "shadow-[0_1px_3px_rgba(0,0,0,0.12),0_6px_16px_-6px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "dark:shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)]",
          "ring-1 ring-black/[0.04] dark:ring-white/10",
          drag
            ? "transition-none"
            : "transition-transform duration-[420ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        )}
        style={{
          transform: `translate3d(${thumbX}px, 0, 0) scale(${(lift + stretch).toFixed(3)}, ${(lift - stretch * 0.45).toFixed(3)})`,
        }}
      />
      {LOCALES.map((target, index) => {
        const isActive = target === locale;
        const isVisual = index === visualIndex;
        const label = LABELS[target];
        const labelClass = cn(
          "relative z-10 flex h-7 w-10 items-center justify-center rounded-full font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors",
          isVisual ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
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
