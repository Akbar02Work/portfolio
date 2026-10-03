import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CopySwapProps = {
  /** Shows `done` instead of `idle`. */
  active: boolean;
  idle: ReactNode;
  done: ReactNode;
  className?: string;
};

/**
 * Blur cross-fade between two faces (as in Creative mode's email). Both faces
 * share one grid cell, so the element keeps the width of the wider face.
 */
export const CopySwap = ({ active, idle, done, className }: CopySwapProps) => {
  return (
    <span className={cn("copy-swap", className)}>
      <span className="copy-swap__face" data-active={!active} aria-hidden={active || undefined}>
        {idle}
      </span>
      <span className="copy-swap__face" data-active={active} aria-hidden={!active || undefined}>
        {done}
      </span>
    </span>
  );
};
