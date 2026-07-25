import { useEffect, useRef } from "react";
import { getBlinkState, getNextBlinkDelay } from "./useBlink";

const FAVICON_SIZE = 64;
const FAVICON_BG = "#0f172a";
const FAVICON_FG = "#ffffff";

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

export const useDynamicFavicon = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);
  const lastStateRef = useRef<boolean | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
      canvasRef.current.width = FAVICON_SIZE;
      canvasRef.current.height = FAVICON_SIZE;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Static icons in index.html otherwise win over dynamic updates.
    const staticIcons = Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"], link[rel="shortcut icon"]',
      ),
    );
    staticIcons.forEach((icon) => {
      icon.dataset.faviconPausedHref = icon.getAttribute("href") ?? "";
      icon.removeAttribute("href");
    });

    const applyFavicon = (dataUrl: string) => {
      document
        .querySelectorAll('link[data-dynamic-favicon="true"]')
        .forEach((node) => node.remove());

      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.sizes = "any";
      link.dataset.dynamicFavicon = "true";
      link.href = dataUrl;
      document.head.appendChild(link);
    };

    const draw = (showUnderscore: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = FAVICON_BG;
      roundRect(ctx, 0, 0, canvas.width, canvas.height, 10);
      ctx.fill();

      ctx.font = `700 34px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = FAVICON_FG;
      // Keep trailing space so "A" stays put when "_" hides.
      ctx.fillText(
        showUnderscore ? "A_" : "A ",
        canvas.width / 2,
        canvas.height / 2 + 2,
      );

      applyFavicon(canvas.toDataURL("image/png"));
    };

    const update = (force = false) => {
      const showUnderscore = reduceMotionRef.current ? true : getBlinkState();
      if (force || lastStateRef.current !== showUnderscore) {
        draw(showUnderscore);
        lastStateRef.current = showUnderscore;
      }
    };

    const scheduleNext = () => {
      clearTimer();
      if (reduceMotionRef.current) {
        return;
      }
      const nextDelay = getNextBlinkDelay();
      timeoutRef.current = window.setTimeout(() => {
        update();
        scheduleNext();
      }, nextDelay);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReduceMotion = () => {
      reduceMotionRef.current = mediaQuery.matches;
      update(true);
      scheduleNext();
    };

    handleReduceMotion();

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimer();
        return;
      }
      update(true);
      scheduleNext();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleReduceMotion);
    } else {
      legacyMediaQuery.addListener?.(handleReduceMotion);
    }

    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleReduceMotion);
      } else {
        legacyMediaQuery.removeListener?.(handleReduceMotion);
      }

      document
        .querySelectorAll('link[data-dynamic-favicon="true"]')
        .forEach((node) => node.remove());

      staticIcons.forEach((icon) => {
        const href = icon.dataset.faviconPausedHref;
        if (href) {
          icon.setAttribute("href", href);
        }
        delete icon.dataset.faviconPausedHref;
      });
    };
  }, []);
};
