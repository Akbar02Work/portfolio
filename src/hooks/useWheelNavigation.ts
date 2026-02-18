import { useCallback, type WheelEvent } from "react";

type UseWheelNavigationOptions = {
  onNext: () => void;
  onPrev: () => void;
  threshold?: number;
};

export const useWheelNavigation = ({
  onNext,
  onPrev,
  threshold = 30,
}: UseWheelNavigationOptions) => {
  const handleWheel = useCallback(
    (event: WheelEvent<HTMLElement>) => {
      const horizontalDelta = Math.abs(event.deltaX);
      const verticalDelta = Math.abs(event.deltaY);

      if (horizontalDelta <= verticalDelta) return;

      event.preventDefault();

      if (event.deltaX > threshold) {
        onNext();
      } else if (event.deltaX < -threshold) {
        onPrev();
      }
    },
    [onNext, onPrev, threshold]
  );

  return { handleWheel };
};
