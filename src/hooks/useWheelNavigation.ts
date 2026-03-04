import { useCallback, useRef, type WheelEvent } from "react";

type UseWheelNavigationOptions = {
  onNext: () => void;
  onPrev: () => void;
  threshold?: number;
};

// When a trackpad swipe occurs, it fires many wheel events in rapid succession (every ~16ms).
// Even after the user lifts their fingers, macOS inertial scrolling keeps firing them.
// A 50ms gap between events is a reliable way to detect when a swipe gesture has fully ended.
const SWIPE_END_TIMEOUT_MS = 50;

export const useWheelNavigation = ({
  onNext,
  onPrev,
  threshold = 50,
}: UseWheelNavigationOptions) => {
  const isSwiping = useRef<boolean>(false);
  const accumulatedDeltaX = useRef<number>(0);
  const resetTimeoutId = useRef<number | null>(null);

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLElement>) => {
      const horizontalDelta = Math.abs(event.deltaX);
      const verticalDelta = Math.abs(event.deltaY);

      // Ignore mostly vertical scrolling
      if (horizontalDelta <= verticalDelta) {
        return;
      }

      // It is a deliberate horizontal swipe, prevent native scrolling
      event.preventDefault();

      // Clear the timeout because a new event just arrived, keeping the stream alive
      if (resetTimeoutId.current !== null) {
        window.clearTimeout(resetTimeoutId.current);
      }

      // Schedule a complete reset when the event stream stops for 50ms
      resetTimeoutId.current = window.setTimeout(() => {
        isSwiping.current = false;
        accumulatedDeltaX.current = 0;
      }, SWIPE_END_TIMEOUT_MS);

      // If we already triggered a navigation for this swipe stream, ignore further events
      if (isSwiping.current) {
        return;
      }

      // Accumulate the horizontal deltas
      accumulatedDeltaX.current += event.deltaX;

      // If accumulated delta exceeds our threshold, trigger navigation
      if (Math.abs(accumulatedDeltaX.current) > threshold) {
        if (accumulatedDeltaX.current > 0) {
          onNext();
        } else {
          onPrev();
        }

        // Lock out any further navigations until this swipe stream completely stops
        isSwiping.current = true;
        accumulatedDeltaX.current = 0;
      }
    },
    [onNext, onPrev, threshold]
  );

  return { handleWheel };
};
