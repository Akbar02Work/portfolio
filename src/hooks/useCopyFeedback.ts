import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

/**
 * Remembers each successful copy. Only the notice and checkmark are temporary.
 * Returns false only when both available clipboard methods fail.
 */
export const useCopyFeedback = <Key extends string>(resetMs = 1800) => {
  const [copiedKey, setCopiedKey] = useState<Key | null>(null);
  const [copiedKeys, setCopiedKeys] = useState<ReadonlySet<Key>>(() => new Set());
  const [checkedKeys, setCheckedKeys] = useState<ReadonlySet<Key>>(() => new Set());
  const timeoutRef = useRef<number | null>(null);
  const checkTimeoutsRef = useRef(new Map<Key, number>());

  useEffect(
    () => {
      const checkTimeouts = checkTimeoutsRef.current;
      return () => {
        if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
        checkTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      };
    },
    []
  );

  const copy = useCallback(
    async (key: Key, text: string) => {
      try {
        if (!await copyText(text)) throw new Error("Copy unavailable");
      } catch {
        setCopiedKey(null);
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        return false;
      }
      setCopiedKeys((previous) => new Set(previous).add(key));
      setCheckedKeys((previous) => new Set(previous).add(key));
      const previousCheckTimeout = checkTimeoutsRef.current.get(key);
      if (previousCheckTimeout !== undefined) window.clearTimeout(previousCheckTimeout);
      checkTimeoutsRef.current.set(key, window.setTimeout(() => {
        setCheckedKeys((previous) => {
          const next = new Set(previous);
          next.delete(key);
          return next;
        });
        checkTimeoutsRef.current.delete(key);
      }, 1500));
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

  return { copiedKey, copiedKeys, checkedKeys, copy };
};
