import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import type { NavigateFunction } from "react-router-dom";

type UseEasterLogoOptions = {
  pathname: string;
  homePath: string;
  easterPath: string;
  navigate: NavigateFunction;
  clicksRequired?: number;
  clickWindowMs?: number;
};

export const useEasterLogo = ({
  pathname,
  homePath,
  easterPath,
  navigate,
  clicksRequired = 5,
  clickWindowMs = 1600,
}: UseEasterLogoOptions) => {
  const easterClickCountRef = useRef(0);
  const easterResetTimerRef = useRef<number | null>(null);

  const resetEasterSequence = useCallback(() => {
    easterClickCountRef.current = 0;
    if (easterResetTimerRef.current !== null) {
      window.clearTimeout(easterResetTimerRef.current);
      easterResetTimerRef.current = null;
    }
  }, []);

  const scheduleEasterReset = useCallback(() => {
    if (easterResetTimerRef.current !== null) {
      window.clearTimeout(easterResetTimerRef.current);
    }
    easterResetTimerRef.current = window.setTimeout(() => {
      resetEasterSequence();
    }, clickWindowMs);
  }, [clickWindowMs, resetEasterSequence]);

  const handleLogoClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== homePath) return;

      event.preventDefault();
      easterClickCountRef.current += 1;

      if (easterClickCountRef.current >= clicksRequired) {
        resetEasterSequence();
        navigate(easterPath);
        return;
      }

      scheduleEasterReset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [
      clicksRequired,
      easterPath,
      homePath,
      navigate,
      pathname,
      resetEasterSequence,
      scheduleEasterReset,
    ]
  );

  useEffect(
    () => () => {
      resetEasterSequence();
    },
    [resetEasterSequence]
  );

  return {
    handleLogoClick,
  };
};
