import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  useNavigate,
  type LinkProps,
  type NavigateOptions,
  type To,
} from "react-router-dom";
import { PageTransitionContext, type PageTransitionContextValue } from "@/hooks/pageTransitionContext";
import { usePageTransitionNavigate } from "@/hooks/usePageTransitionNavigate";

type TransitionPhase = "idle" | "cover" | "reveal";

const COVER_MS = 304;
const REVEAL_MS = 304;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Decode the new theme's visible screenshots and video posters under the curtain. */
const waitForVisibleMedia = async () => {
  const inViewport = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 &&
      rect.top < window.innerHeight && rect.left < window.innerWidth;
  };
  const images = Array.from(document.images).filter(inViewport);
  for (const video of document.querySelectorAll<HTMLVideoElement>("video[poster]")) {
    if (!inViewport(video)) continue;
    const poster = new Image();
    poster.src = video.poster;
    images.push(poster);
  }

  // A slow or failed request must not leave the page covered indefinitely.
  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, 1500);
    void Promise.all(images.map((image) => image.decode().catch(() => {}))).then(() => {
      window.clearTimeout(timeout);
      resolve();
    });
  });
};

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [background, setBackground] = useState<string>();
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const runWithTransition = useCallback<PageTransitionContextValue["runWithTransition"]>(
    (update, options) => {
      if (busyRef.current) return;

      if (prefersReducedMotion()) {
        update();
        return;
      }

      busyRef.current = true;
      // Keep the old color above the newly themed page throughout the reveal.
      setBackground(overlayRef.current ? getComputedStyle(overlayRef.current).backgroundColor : undefined);

      void (async () => {
        try {
          // Rise from bottom → cover, then update the page out of sight.
          setPhase("cover");
          await wait(COVER_MS);
          update();
          await wait(48);
          if (options?.waitForMedia) await waitForVisibleMedia();

          // Continue upward and reveal the updated page from the bottom.
          setPhase("reveal");
          await wait(REVEAL_MS);
        } finally {
          setPhase("idle");
          setBackground(undefined);
          busyRef.current = false;
        }
      })();
    },
    []
  );

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => runWithTransition(() => navigate(to, options)),
    [navigate, runWithTransition]
  );

  const value = useMemo(
    () => ({ navigateWithTransition, runWithTransition, isTransitioning: phase !== "idle" }),
    [navigateWithTransition, runWithTransition, phase]
  );

  // idle/reveal-end: below screen → cover: on screen → reveal: above screen
  const overlayTransform =
    phase === "cover"
      ? "translate3d(0, 0, 0)"
      : phase === "reveal"
        ? "translate3d(0, -101%, 0)"
        : "translate3d(0, 101%, 0)";

  const overlayTransition =
    phase === "idle" ? "none" : `transform ${phase === "cover" ? COVER_MS : REVEAL_MS}ms ${EASE}`;

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        className="page-transition-overlay"
        data-phase={phase}
        aria-hidden="true"
        style={{
          transform: overlayTransform,
          transition: overlayTransition,
          backgroundColor: background,
          pointerEvents: phase === "idle" ? "none" : "auto",
        }}
      />
    </PageTransitionContext.Provider>
  );
}

type PageTransitionLinkProps = LinkProps & {
  viewTransition?: boolean;
};

/** Link that plays a bottom→top curtain wipe before route change. */
export function PageTransitionLink({
  viewTransition = true,
  onClick,
  to,
  replace,
  state,
  preventScrollReset,
  relative,
  ...rest
}: PageTransitionLinkProps) {
  const navigate = usePageTransitionNavigate();

  return (
    <Link
      to={to}
      replace={replace}
      state={state}
      preventScrollReset={preventScrollReset}
      relative={relative}
      onClick={(event) => {
        onClick?.(event);
        if (
          !viewTransition ||
          rest.reloadDocument ||
          (rest.target && rest.target !== "_self") ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return;
        }

        event.preventDefault();
        navigate(to, { replace, state, preventScrollReset, relative });
      }}
      {...rest}
    />
  );
}

export const ViewTransitionLink = PageTransitionLink;
