import { useLayoutEffect } from "react";

/** Keep scrolled page pixels out of iPhone Safari's translucent status bar. */
export const useSafariViewportClip = () => {
  useLayoutEffect(() => {
    if (!/iPhone/.test(navigator.userAgent) || !/AppleWebKit/.test(navigator.userAgent)) return;
    const root = document.getElementById("root");
    if (!root) return;

    const previousClip = root.style.clipPath;
    const viewport = window.visualViewport;
    let frame: number | null = null;
    const isZoomed = () => Math.abs((viewport?.scale ?? 1) - 1) > 0.001;

    const update = () => {
      frame = null;
      // Pinch zoom moves the visual viewport independently of the page layout.
      // Let Safari handle it instead of clipping away enlarged page content.
      if (isZoomed()) {
        root.style.clipPath = previousClip;
        return;
      }
      // Safari can expose scrolling document pixels above its fixed viewport
      // even when safe-area-inset-top is zero. Clip those pixels at the source.
      // This leaves window scrolling, anchor links and fixed children intact.
      const top = Math.max(0, (viewport?.offsetTop ?? 0) - root.getBoundingClientRect().top);
      root.style.clipPath = `inset(${top}px 0 0)`;
    };
    const schedule = () => {
      // Remove a stale clip immediately as zoom starts, before the next frame.
      if (isZoomed()) {
        if (frame !== null) window.cancelAnimationFrame(frame);
        update();
        return;
      }
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule, { passive: true });
    viewport?.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      viewport?.removeEventListener("resize", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
      root.style.clipPath = previousClip;
    };
  }, []);
};
