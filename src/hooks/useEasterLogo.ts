import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { scrollBehavior } from "@/lib/motion";

type UseEasterLogoOptions = {
  pathname: string;
  homePath: string;
  /** Called when the logo has been clicked `clicksRequired` times. */
  onUnlock: () => void;
  clicksRequired?: number;
  clickWindowMs?: number;
};

export const useEasterLogo = ({
  pathname,
  homePath,
  onUnlock,
  clicksRequired = 3,
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
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

      event.preventDefault();
      easterClickCountRef.current += 1;

      if (easterClickCountRef.current >= clicksRequired) {
        resetEasterSequence();
        onUnlock();
        return;
      }

      scheduleEasterReset();
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    },
    [
      clicksRequired,
      homePath,
      onUnlock,
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
