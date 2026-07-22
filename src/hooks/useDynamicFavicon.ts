import { useEffect, useRef } from "react";
import { getBlinkState, getNextBlinkDelay } from "./useBlink";

export const useDynamicFavicon = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const linkRef = useRef<HTMLLinkElement | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const reduceMotionRef = useRef(false);
    const lastStateRef = useRef<boolean | null>(null);
    const lastThemeRef = useRef<"light" | "dark" | null>(null);

    useEffect(() => {
        const clearTimer = () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        // Initialize canvas
        if (!canvasRef.current) {
            canvasRef.current = document.createElement("canvas");
            canvasRef.current.width = 64;
            canvasRef.current.height = 64;
        }

        // Initialize or find link tag
        if (!linkRef.current) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            linkRef.current = link;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const link = linkRef.current;

        if (!ctx || !link) return;

        const getTheme = () =>
            document.documentElement.classList.contains("dark") ? "dark" : "light";

        const draw = (showUnderscore: boolean) => {
            const theme = getTheme();
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Text settings
            ctx.font = "bold 40px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";

            const text = showUnderscore ? "A_" : "A ";

            // Draw text
            // Center position
            ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4); // +4 for vertical adjustment

            // Update favicon
            link.href = canvas.toDataURL("image/png");
        };

        const update = (force = false) => {
            const now = Date.now();
            const showUnderscore = reduceMotionRef.current ? true : getBlinkState(now);
            const theme = getTheme();
            if (
                force ||
                lastStateRef.current !== showUnderscore ||
                lastThemeRef.current !== theme
            ) {
                draw(showUnderscore);
                lastStateRef.current = showUnderscore;
                lastThemeRef.current = theme;
            }
        };

        const scheduleNext = () => {
            clearTimer();
            if (reduceMotionRef.current) {
                return;
            }
            const now = Date.now();
            const nextDelay = getNextBlinkDelay(now);
            timeoutRef.current = window.setTimeout(() => {
                update();
                scheduleNext();
            }, nextDelay);
        };

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleReduceMotion = () => {
            reduceMotionRef.current = mediaQuery.matches;
            update(true);
            scheduleNext();
        };

        handleReduceMotion();

        const handleVisibility = () => {
            if (document.hidden) {
                clearTimer();
                return;
            }
            update(true);
            scheduleNext();
        };

        const observer = new MutationObserver(() => update(true));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        document.addEventListener("visibilitychange", handleVisibility);

        const legacyMediaQuery = mediaQuery as MediaQueryList & {
            addListener?: (listener: () => void) => void;
            removeListener?: (listener: () => void) => void;
        };

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleReduceMotion);
        } else {
            legacyMediaQuery.addListener?.(handleReduceMotion);
        }

        return () => {
            clearTimer();
            observer.disconnect();
            document.removeEventListener("visibilitychange", handleVisibility);
            if (typeof mediaQuery.removeEventListener === "function") {
                mediaQuery.removeEventListener("change", handleReduceMotion);
            } else {
                legacyMediaQuery.removeListener?.(handleReduceMotion);
            }
        };
    }, []);
};
