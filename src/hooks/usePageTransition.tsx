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
import { PageTransitionContext } from "@/hooks/pageTransitionContext";
import { usePageTransitionNavigate } from "@/hooks/usePageTransitionNavigate";

type TransitionPhase = "idle" | "cover" | "reveal";

const COVER_MS = 420;
const REVEAL_MS = 420;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const busyRef = useRef(false);

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => {
      if (busyRef.current) return;

      if (prefersReducedMotion()) {
        navigate(to, options);
        return;
      }

      busyRef.current = true;

      void (async () => {
        // Rise from bottom → cover
        setPhase("cover");
        await wait(COVER_MS);

        navigate(to, options);
        // Destination mounts + instant scroll under the curtain
        await wait(48);

        // Continue upward and exit through the top (same direction, both ways)
        setPhase("reveal");
        await wait(REVEAL_MS);

        // Snap back under the viewport with no animation
        setPhase("idle");
        busyRef.current = false;
      })();
    },
    [navigate]
  );

  const value = useMemo(
    () => ({ navigateWithTransition }),
    [navigateWithTransition]
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
        className="page-transition-overlay"
        aria-hidden="true"
        style={{
          transform: overlayTransform,
          transition: overlayTransition,
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
