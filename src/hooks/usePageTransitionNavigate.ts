import { useCallback, useContext } from "react";
import {
  useNavigate,
  type NavigateOptions,
  type To,
} from "react-router-dom";
import { PageTransitionContext } from "@/hooks/pageTransitionContext";

export const usePageTransitionNavigate = () => {
  const context = useContext(PageTransitionContext);
  const navigate = useNavigate();

  return useCallback(
    (to: To, options?: NavigateOptions) => {
      if (context) {
        context.navigateWithTransition(to, options);
        return;
      }
      navigate(to, options);
    },
    [context, navigate]
  );
};
