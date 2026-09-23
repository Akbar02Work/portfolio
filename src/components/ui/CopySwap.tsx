import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CopySwapProps = {
  /** Shows `done` instead of `idle`. */
  active: boolean;
  idle: ReactNode;
  done: ReactNode;
  /** Increment on every successful copy to replay the rubber bounce. */
  pulse?: number;
  className?: string;
};

/**
 * Blur morph between two faces (as in Creative mode's email) plus a
 * spring "rubber" bounce on each copy. Both faces share one grid cell, so
 * the element keeps the width of the wider face and never jumps.
 */
export const CopySwap = ({ active, idle, done, pulse = 0, className }: CopySwapProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || pulse === 0) return;
    el.classList.remove("copy-rubber");
    void el.offsetWidth; // restart the animation
    el.classList.add("copy-rubber");
  }, [pulse]);

  return (
    <span ref={ref} className={cn("copy-swap", className)}>
      <span className="copy-swap__face" data-face="idle" data-active={!active} aria-hidden={active || undefined}>
        {idle}
      </span>
      <span className="copy-swap__face" data-face="done" data-active={active} aria-hidden={!active || undefined}>
        {done}
      </span>
    </span>
  );
};
