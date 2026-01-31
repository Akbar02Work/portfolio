import { useCallback, useRef } from "react";

/**
 * Returns a throttled version of the callback function.
 * The callback will only be executed at most once every `delay` milliseconds.
 * This implementation is "leading" (executes immediately if enough time has passed).
 *
 * @param callback The function to throttle
 * @param delay The throttle delay in milliseconds
 * @returns A throttled callback function
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const lastRun = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
}
