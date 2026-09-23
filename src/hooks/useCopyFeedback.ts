import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text and exposes which key was copied last, clearing it after a delay.
 * Returns false when the Clipboard API is unavailable or rejected.
 */
export const useCopyFeedback = <Key extends string>(resetMs = 1800) => {
  const [copiedKey, setCopiedKey] = useState<Key | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const copy = useCallback(
    async (key: Key, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopiedKey(key);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setCopiedKey(null);
        timeoutRef.current = null;
      }, resetMs);
      return true;
    },
    [resetMs]
  );

  return { copiedKey, copy };
};
