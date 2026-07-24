import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

const getBottomRootMarginPx = (rootMargin: string) => {
  const parts = rootMargin.trim().split(/\s+/);
  const bottomValue = parts.length >= 3 ? parts[2] : parts[0];
  return bottomValue?.endsWith("px") ? Number.parseFloat(bottomValue) || 0 : 0;
};

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);
  const [skipTransition, setSkipTransition] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setReduceMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsVisible(true);
        setSkipTransition(true);
      }
    };

    handleChange();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };
    legacyMediaQuery.addListener?.(handleChange);
    return () => legacyMediaQuery.removeListener?.(handleChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let revealIfReached: () => void = () => undefined;
    let previousScrollY = window.scrollY;
    let hasHandledObserverEntry = false;
    const reveal = (immediately = false) => {
      if (immediately) {
        setSkipTransition(true);
      }
      setIsVisible(true);
      if (triggerOnce) {
        observer?.unobserve(element);
        window.removeEventListener("scroll", revealIfReached);
      }
    };
    revealIfReached = () => {
      const bottomMarginPx = getBottomRootMarginPx(rootMargin);
      const elementTop = element.getBoundingClientRect().top;
      const currentScrollY = window.scrollY;
      const rapidJump = Math.abs(currentScrollY - previousScrollY) >= window.innerHeight * 0.75;
      if (elementTop <= window.innerHeight + bottomMarginPx) {
        reveal(rapidJump || elementTop < 0);
      }
      previousScrollY = currentScrollY;
    };

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const hasPassedViewport = entry.boundingClientRect.top < 0;
        const restoredDeepPosition =
          !hasHandledObserverEntry && window.scrollY >= window.innerHeight;
        hasHandledObserverEntry = true;
        if (entry.isIntersecting || hasPassedViewport) {
          reveal(hasPassedViewport || restoredDeepPosition);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    window.addEventListener("scroll", revealIfReached, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", revealIfReached);
    };
  }, [reduceMotion, threshold, rootMargin, triggerOnce]);

  return { ref, isVisible, reduceMotion, skipTransition };
}
