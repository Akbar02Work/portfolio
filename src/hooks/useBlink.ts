import { useCallback, useEffect, useRef, useState } from "react";

export const BLINK_ON_DURATION = 3000;
export const BLINK_OFF_DURATION = 1000;
export const BLINK_CYCLE_DURATION = BLINK_ON_DURATION + BLINK_OFF_DURATION;

export const getBlinkState = (now = Date.now()) =>
    now % BLINK_CYCLE_DURATION < BLINK_ON_DURATION;

export const getNextBlinkDelay = (now = Date.now()) => {
    const timeInCycle = now % BLINK_CYCLE_DURATION;
    if (timeInCycle < BLINK_ON_DURATION) {
        return BLINK_ON_DURATION - timeInCycle;
    }
    return BLINK_CYCLE_DURATION - timeInCycle;
};

export const useBlink = () => {
    const [isVisible, setIsVisible] = useState(() => getBlinkState());
    const [reduceMotion, setReduceMotion] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const scheduleNextRef = useRef<() => void>(() => undefined);

    const clearTimer = useCallback(() => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const scheduleNext = useCallback(() => {
        clearTimer();
        const now = Date.now();
        const nextDelay = getNextBlinkDelay(now);
        setIsVisible((prev) => {
            const next = getBlinkState(now);
            return prev === next ? prev : next;
        });
        timeoutRef.current = window.setTimeout(() => {
            setIsVisible((prev) => {
                const next = getBlinkState();
                return prev === next ? prev : next;
            });
            scheduleNextRef.current();
        }, nextDelay);
    }, [clearTimer]);

    useEffect(() => {
        scheduleNextRef.current = scheduleNext;
    }, [scheduleNext]);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = () => setReduceMotion(mediaQuery.matches);
        handleChange();
        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        const legacyMediaQuery = mediaQuery as MediaQueryList & {
            addListener?: (listener: () => void) => void;
            removeListener?: (listener: () => void) => void;
        };
        legacyMediaQuery.addListener?.(handleChange);
        return () => legacyMediaQuery.removeListener?.(handleChange);
    }, []);

    useEffect(() => {
        if (reduceMotion) {
            clearTimer();
            setIsVisible(true);
            return;
        }

        const handleVisibility = () => {
            if (document.hidden) {
                clearTimer();
                return;
            }
            scheduleNext();
        };

        scheduleNext();
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            clearTimer();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [clearTimer, reduceMotion, scheduleNext]);

    return isVisible;
};
