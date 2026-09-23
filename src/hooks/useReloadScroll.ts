import { useLayoutEffect } from "react";

/** Preserve a full-page reload even in browsers that restore before the SPA mounts. */
export const useReloadScroll = () => {
  useLayoutEffect(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const saved = window.history.state?.portfolioScroll as { pathname?: string; top?: number } | undefined;
    if (
      entry?.type === "reload" && saved?.pathname === window.location.pathname &&
      typeof saved.top === "number" && Number.isFinite(saved.top)
    ) {
      window.scrollTo({ top: saved.top, behavior: "instant" });
    }

    const save = () => {
      window.history.replaceState({
        ...window.history.state,
        portfolioScroll: { pathname: window.location.pathname, top: window.scrollY },
      }, "");
    };
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, []);
};
