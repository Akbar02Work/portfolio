import { useLayoutEffect, useRef } from "react";

export const slidingIndicatorTransition =
  "transition-[transform,width] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const HIDDEN_CLIP = "inset(0 100% 0 0)";

/** A shared background whose foreground labels follow its rendered bounds. */
export const useSlidingIndicator = (
  value: string,
  { position = null, itemsKey = "" }: { position?: number | null; itemsKey?: string } = {},
) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const selectionRef = useRef({ value, position });
  const updateRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    selectionRef.current = { value, position };
    updateRef.current?.();
  }, [value, position, itemsKey]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const indicator = indicatorRef.current;
    if (!root || !indicator) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let initialized = false;
    let frame: number | null = null;
    let disposed = false;

    const stopSync = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };

    const syncClips = () => {
      const pill = indicator.getBoundingClientRect();
      const labels = Array.from(root.querySelectorAll<HTMLElement>("[data-indicator-label]"));
      // Read every label before writing masks to avoid repeated layout flushes.
      const clips = labels.map((label) => {
        const bounds = label.getBoundingClientRect();
        const left = Math.max(0, Math.min(bounds.width, pill.left - bounds.left));
        const right = Math.max(0, Math.min(bounds.width, bounds.right - pill.right));
        return left + right >= bounds.width ? HIDDEN_CLIP : `inset(0 ${right}px 0 ${left}px)`;
      });
      labels.forEach((label, index) => {
        const clip = clips[index];
        if (clip !== undefined && label.style.clipPath !== clip) label.style.clipPath = clip;
      });
      return pill;
    };

    const update = () => {
      stopSync();
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-indicator-value]"));
      const { value: selected, position: draggedPosition } = selectionRef.current;
      const target = items.find((item) => item.dataset.indicatorValue === selected);
      const bounds = target?.getBoundingClientRect();
      if (!bounds?.width) {
        indicator.style.opacity = "0";
        initialized = false;
        root.querySelectorAll<HTMLElement>("[data-indicator-label]").forEach((label) => {
          label.style.clipPath = label.parentElement === target ? "inset(0)" : HIDDEN_CLIP;
        });
        return;
      }

      const rootBounds = root.getBoundingClientRect();
      const left = draggedPosition === null
        ? bounds.left
        : (items[0]?.getBoundingClientRect().left ?? bounds.left) + draggedPosition;
      const animate = initialized && draggedPosition === null && !media.matches;
      indicator.style.transition = animate ? "" : "none";
      indicator.style.width = `${bounds.width}px`;
      indicator.style.height = `${bounds.height}px`;
      indicator.style.top = `${bounds.top - rootBounds.top - root.clientTop + root.scrollTop}px`;
      indicator.style.transform = `translate3d(${left - rootBounds.left - root.clientLeft + root.scrollLeft}px, 0, 0)`;
      indicator.style.opacity = "1";
      initialized = true;
      const pill = syncClips();

      if (animate && (Math.abs(pill.left - left) > 0.01 || Math.abs(pill.width - bounds.width) > 0.01)) {
        // Follow the CSS transition, including a new selection during a glide.
        // One final pass after 300ms also handles a throttled/background frame.
        const until = performance.now() + 300;
        const tick = (now: number) => {
          syncClips();
          frame = now < until ? requestAnimationFrame(tick) : null;
        };
        frame = requestAnimationFrame(tick);
      }
    };

    updateRef.current = update;
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(root);
    root.querySelectorAll("[data-indicator-value]").forEach((item) => observer?.observe(item));
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    void document.fonts?.ready.then(() => {
      if (!disposed) update();
    });

    return () => {
      disposed = true;
      stopSync();
      updateRef.current = null;
      observer?.disconnect();
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, [itemsKey]);

  return { rootRef, indicatorRef };
};
