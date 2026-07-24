import { createContext } from "react";
import type { NavigateOptions, To } from "react-router-dom";

export type PageTransitionContextValue = {
  navigateWithTransition: (to: To, options?: NavigateOptions) => void;
};

export const PageTransitionContext =
  createContext<PageTransitionContextValue | null>(null);
