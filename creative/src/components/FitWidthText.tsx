import { useLayoutEffect, useRef, type ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  /** Re-run fit when these change (fonts/reveal/layout). */
  deps?: unknown[];
};

/**
 * Horizontally stretches a single line to the parent width via scaleX,
 * keeping font-size / visual height unchanged.
 */
export function FitWidthText({ className, children, deps = [] }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      const available = parent.clientWidth;
      if (available <= 0) return;

      el.style.transform = "scaleX(1)";
      const natural = el.scrollWidth;
      if (natural <= 0) return;

      const scale = available / natural;
      el.style.transform = `scaleX(${scale})`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);

    const fontsReady = document.fonts?.ready;
    fontsReady?.then(fit);

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <em ref={ref} className={className}>
      {children}
    </em>
  );
}
