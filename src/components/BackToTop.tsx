import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollBehavior } from "@/lib/motion";
import { useI18n } from "@/i18n/useI18n";
import { LocalizedText } from "@/components/ui/LocalizedText";

export const BackToTop = ({ placement = "floating" }: { placement?: "floating" | "footer" }) => {
    const { t } = useI18n();
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const blurButton = () => {
        const el = buttonRef.current;
        if (!el) return;
        window.setTimeout(() => el.blur(), 0);
    };

    useEffect(() => {
        if (placement === "footer") return;
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
    }, [placement]);

    const visible = placement === "footer" || isVisible;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: scrollBehavior(),
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
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            className={cn(
                "no-touch-hover touch-no-ring items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt-ink dark:focus-visible:outline-volt",
                placement === "footer"
                    ? "inline-flex min-[901px]:hidden shrink-0 gap-2 py-2 text-sm font-semibold text-volt-ink dark:text-volt transition-opacity duration-300 hover:opacity-75 active:translate-y-px"
                    : "hidden min-[901px]:inline-flex fixed bottom-8 right-8 z-40 p-3 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg transition-all duration-300 hover:scale-110 active:scale-95",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
            aria-label={t.nav.backToTop}
        >
            {placement === "footer" && <LocalizedText>{copy => copy.nav.backToTop}</LocalizedText>}
            <ArrowUp className={placement === "footer" ? "w-4 h-4" : "w-6 h-6"} strokeWidth={2} aria-hidden="true" />
        </button>
    );
};
