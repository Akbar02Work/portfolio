import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { MainLayout } from "@/components/layout/MainLayout";
import { projectsSummary } from "@/data/projectsSummary";
import { storage } from "@/lib/storage";

const SCROLL_STORAGE_KEY = "scrollY";
const SCROLL_WRITE_THROTTLE_MS = 500;
const IDLE_WRITE_TIMEOUT_MS = 1000;

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle state-driven navigation (e.g., from ProjectDetail)
  useLayoutEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;

    const rafId = window.requestAnimationFrame(() => {
      if (scrollTo === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(scrollTo);
        element?.scrollIntoView({ behavior: "smooth" });
      }
      navigate(location.pathname, { replace: true, state: null });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [location.pathname, location.state, navigate]);

  useLayoutEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload =
      navEntry && "type" in navEntry && navEntry.type === "reload";

    if (isReload) {
      const savedScrollY = storage.get<number>(SCROLL_STORAGE_KEY, 0, { area: "session" });
      if (savedScrollY > 0) {
        window.scrollTo({ top: savedScrollY, behavior: "auto" });
      }
    }
  }, []);

  useEffect(() => {
    let throttleTimerId: number | null = null;
    let idleTaskId: number | null = null;
    let lastWriteAt = 0;

    const flushScroll = () => {
      storage.set(SCROLL_STORAGE_KEY, window.scrollY, { area: "session" });
    };

    const cancelIdleTask = () => {
      if (idleTaskId === null) return;
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleTaskId);
      } else {
        window.clearTimeout(idleTaskId);
      }
      idleTaskId = null;
    };

    const scheduleIdleFlush = () => {
      cancelIdleTask();

      if ("requestIdleCallback" in window) {
        idleTaskId = window.requestIdleCallback(
          () => {
            idleTaskId = null;
            flushScroll();
          },
          { timeout: IDLE_WRITE_TIMEOUT_MS }
        );
        return;
      }

      idleTaskId = window.setTimeout(() => {
        idleTaskId = null;
        flushScroll();
      }, 120);
    };

    const throttledSaveScroll = () => {
      const now = Date.now();
      const elapsed = now - lastWriteAt;

      if (elapsed >= SCROLL_WRITE_THROTTLE_MS) {
        lastWriteAt = now;
        scheduleIdleFlush();
        return;
      }

      if (throttleTimerId !== null) return;

      throttleTimerId = window.setTimeout(() => {
        throttleTimerId = null;
        lastWriteAt = Date.now();
        scheduleIdleFlush();
      }, SCROLL_WRITE_THROTTLE_MS - elapsed);
    };

    const handlePageHide = () => {
      if (throttleTimerId !== null) {
        window.clearTimeout(throttleTimerId);
        throttleTimerId = null;
      }
      cancelIdleTask();
      flushScroll();
    };

    window.addEventListener("scroll", throttledSaveScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      if (throttleTimerId !== null) {
        window.clearTimeout(throttleTimerId);
      }
      cancelIdleTask();
      window.removeEventListener("scroll", throttledSaveScroll);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return (
    <MainLayout
      variant="home"
      className="bg-[#f8f9fa] dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased overflow-x-hidden font-sans transition-colors duration-300"
    >
      <Hero />
      <TechStack />
      <About />
      <Projects projects={projectsSummary} />
    </MainLayout>
  );
};

export default Index;
