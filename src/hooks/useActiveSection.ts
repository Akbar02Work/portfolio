import { useCallback, useEffect, useRef, useState } from "react";
import { scrollBehavior } from "@/lib/motion";

type UseActiveSectionOptions<T extends string> = {
  isHome: boolean;
  pathname: string;
  sectionIds: readonly T[];
  detailSection: T | "";
  homeSection: T;
  /** Section to force-activate at the very bottom of the page; omit to disable. */
  bottomSectionId?: T;
  offsetPx: number;
};

export const useActiveSection = <T extends string>({
  isHome,
  pathname,
  sectionIds,
  detailSection,
  homeSection,
  bottomSectionId,
  offsetPx,
}: UseActiveSectionOptions<T>) => {
  const [activeSection, setActiveSection] = useState<T | "">(
    isHome ? homeSection : detailSection
  );
  const observedSectionRef = useRef(activeSection);
  const scrollCleanupRef = useRef<(() => void) | null>(null);

  const updateActiveSection = useCallback((nextSection: T | "") => {
    observedSectionRef.current = nextSection;
    if (scrollCleanupRef.current) return;
    setActiveSection((previous) => previous === nextSection ? previous : nextSection);
  }, []);

  const scrollToSection = useCallback((sectionId: T) => {
    const section = document.getElementById(sectionId);
    if (sectionId !== homeSection && !section) return;

    scrollCleanupRef.current?.();
    setActiveSection(sectionId);
    let settleTimer: number;

    function finishScroll() {
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", interruptScroll);
      window.removeEventListener("touchstart", interruptScroll);
      window.removeEventListener("touchmove", interruptScroll);
      window.removeEventListener("pointerdown", interruptScroll);
      window.removeEventListener("keydown", onKeyDown);
      scrollCleanupRef.current = null;
    }

    function resumeTracking() {
      finishScroll();
      setActiveSection(observedSectionRef.current);
    }

    function interruptScroll(event?: Event) {
      // A new section click replaces the target without flashing the section
      // currently passing beneath the header between pointerdown and click.
      if ((event?.type === "pointerdown" || event?.type === "touchstart") &&
        event.target instanceof Element && event.target.closest("[data-nav-section]")) return;
      finishScroll();
      window.scrollTo({ top: window.scrollY, behavior: "instant" });
      setActiveSection(observedSectionRef.current);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        interruptScroll();
      }
    }

    // Wait for scrolling to settle, including browsers without scrollend support.
    // Each new click replaces the previous target and its listeners.
    function onScroll() {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(resumeTracking, 160);
    }

    scrollCleanupRef.current = finishScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", interruptScroll, { passive: true });
    window.addEventListener("touchstart", interruptScroll, { passive: true });
    window.addEventListener("touchmove", interruptScroll, { passive: true });
    window.addEventListener("pointerdown", interruptScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    onScroll();

    if (sectionId === homeSection) {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    } else {
      section?.scrollIntoView({ behavior: scrollBehavior() });
    }
  }, [homeSection]);

  useEffect(() => () => scrollCleanupRef.current?.(), [isHome, pathname]);

  useEffect(() => {
    if (!isHome) {
      const detailDefault = detailSection;
      updateActiveSection(detailDefault);

      let rafId = 0;
      const handleBottomCheck = () => {
        if (!bottomSectionId) return;
        const bottomSection = document.getElementById(bottomSectionId);
        if (!bottomSection) return;

        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 50;

        if (isAtBottom) {
          updateActiveSection(bottomSectionId);
        } else {
          updateActiveSection(detailDefault);
        }
      };

      const onScroll = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          handleBottomCheck();
        });
      };

      handleBottomCheck();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      let rafId = 0;

      const updateFromPosition = () => {
        let closest = sections[0]!;
        let minDistance = Number.POSITIVE_INFINITY;

        for (const section of sections) {
          const distance = Math.abs(
            section.getBoundingClientRect().top - offsetPx
          );
          if (distance < minDistance) {
            minDistance = distance;
            closest = section;
          }
        }

        const bottomSection = bottomSectionId ? document.getElementById(bottomSectionId) : null;
        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;
        if (bottomSection && isAtBottom) {
          closest = bottomSection;
        }

        const nextId = closest.id as T;
        updateActiveSection(nextId);
      };

      const onScroll = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          updateFromPosition();
        });
      };

      updateFromPosition();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    const sectionStates = new Map<
      string,
      { top: number; isIntersecting: boolean }
    >();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          sectionStates.set(entry.target.id, {
            top: entry.boundingClientRect.top,
            isIntersecting: entry.isIntersecting,
          });
        }

        const visibleSections = Array.from(sectionStates.entries()).filter(
          ([, data]) => data.isIntersecting
        );

        if (visibleSections.length === 0) return;

        visibleSections.sort(
          (a, b) => Math.abs(a[1].top - offsetPx) - Math.abs(b[1].top - offsetPx)
        );

        const nextId = visibleSections[0]![0] as T;
        updateActiveSection(nextId);
      },
      {
        rootMargin: `-${offsetPx}px 0px -20% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => {
      sectionStates.set(section.id, {
        top: Number.POSITIVE_INFINITY,
        isIntersecting: false,
      });
      observer.observe(section);
    });

    let rafId = 0;
    const handleBottomCheck = () => {
      if (!bottomSectionId) return;
      const bottomSection = document.getElementById(bottomSectionId);
      if (!bottomSection) return;
      const isAtBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        updateActiveSection(bottomSectionId);
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        handleBottomCheck();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handleBottomCheck();

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
    };
  }, [
    bottomSectionId,
    detailSection,
    homeSection,
    isHome,
    offsetPx,
    pathname,
    sectionIds,
    updateActiveSection,
  ]);

  return {
    activeSection,
    setActiveSection,
    scrollToSection,
  };
};
