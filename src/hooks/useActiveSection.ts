import { useEffect, useState } from "react";

type UseActiveSectionOptions<T extends string> = {
  isHome: boolean;
  pathname: string;
  sectionIds: readonly T[];
  detailSection: T | "";
  homeSection: T;
  bottomSectionId: T;
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

  useEffect(() => {
    if (!isHome) {
      const detailDefault = detailSection;
      setActiveSection(detailDefault);

      let rafId = 0;
      const handleBottomCheck = () => {
        const bottomSection = document.getElementById(bottomSectionId);
        if (!bottomSection) return;

        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 50;

        if (isAtBottom) {
          setActiveSection((prev) =>
            prev === bottomSectionId ? prev : bottomSectionId
          );
        } else {
          setActiveSection((prev) =>
            prev === detailDefault ? prev : detailDefault
          );
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

    if (!("IntersectionObserver" in window)) {
      let rafId = 0;

      const updateActiveSection = () => {
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

        const bottomSection = document.getElementById(bottomSectionId);
        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;
        if (bottomSection && isAtBottom) {
          closest = bottomSection;
        }

        const nextId = closest.id as T;
        setActiveSection((prev) => (prev === nextId ? prev : nextId));
      };

      const onScroll = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          updateActiveSection();
        });
      };

      updateActiveSection();
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

        const nextId = visibleSections[0][0] as T;
        setActiveSection((prev) => (prev === nextId ? prev : nextId));
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
      const bottomSection = document.getElementById(bottomSectionId);
      if (!bottomSection) return;
      const isAtBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection((prev) => (prev === bottomSectionId ? prev : bottomSectionId));
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
  ]);

  return {
    activeSection,
    setActiveSection,
  };
};
