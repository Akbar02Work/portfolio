import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Hero } from "@/components/sections/Hero";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { MainLayout } from "@/components/layout/MainLayout";
import { projectsSummary } from "@/data/projectsSummary";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle state-driven navigation (e.g., from ProjectDetail).
  // Instant jump — the curtain already handles the visual transition.
  useLayoutEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;

    if (scrollTo === "home") {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(scrollTo);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, Math.max(0, top));
      }
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;
    if (navigationEntry?.type !== "reload") return;

    const handleFirstWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      window.removeEventListener("wheel", handleFirstWheel);
      const scrollYBeforeWheel = window.scrollY;
      const deltaMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;

      window.requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - scrollYBeforeWheel) < 1) {
          window.scrollBy({
            top: event.deltaY * deltaMultiplier,
            behavior: "auto",
          });
        }
      });
    };

    window.addEventListener("wheel", handleFirstWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleFirstWheel);
  }, []);

  return (
    <MainLayout
      variant="home"
      className="bg-background text-gray-900 dark:text-slate-100 antialiased overflow-x-clip font-sans"
    >
      <Helmet>
        <title>Akbar — Android &amp; AI Engineer</title>
        <meta
          name="description"
          content="Android apps built with Kotlin and Jetpack Compose, with practical AI integrations."
        />
      </Helmet>
      <Hero />
      <TechStack />
      <Projects projects={projectsSummary} />
      <About />
    </MainLayout>
  );
};

export default Index;
