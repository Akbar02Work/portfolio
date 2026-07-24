import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const blurButton = () => {
        const el = buttonRef.current;
        if (!el) return;
        window.setTimeout(() => el.blur(), 0);
    };

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        let rafId = 0;
        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = 0;
                toggleVisibility();
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        toggleVisibility();

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        // Remove focus after tap to avoid sticky "pressed" state on touch devices.
        blurButton();
    };

    return (
        <button
            ref={buttonRef}
            onClick={scrollToTop}
            onPointerUp={blurButton}
            onPointerCancel={blurButton}
            onTouchEnd={blurButton}
            onTouchCancel={blurButton}
            type="button"
            className={cn(
                "no-touch-hover touch-no-ring fixed bottom-8 right-8 z-50 p-3 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none ring-2 ring-transparent ring-offset-2 ring-offset-white dark:ring-offset-slate-950 hover:ring-volt-ink dark:hover:ring-volt active:ring-volt-ink dark:active:ring-volt focus-visible:ring-volt-ink dark:focus-visible:ring-volt",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
            aria-label="Back to top"
        >
            <ArrowUp className="w-6 h-6" strokeWidth={2} />
        </button>
    );
};
