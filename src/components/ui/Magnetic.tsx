import { useRef, type MouseEvent, type ReactNode } from "react";

const MAX_OFFSET_PX = 8;
const PULL_RATIO = 0.3;

interface MagneticProps {
    children: ReactNode;
    className?: string;
}

/** Subtle cursor-pull wrapper — respects prefers-reduced-motion, pointer-only */
export const Magnetic = ({ children, className = "" }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        const element = ref.current;
        if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const rect = element.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * PULL_RATIO;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * PULL_RATIO;
        const clamp = (value: number) => Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, value));
        element.style.transform = `translate(${clamp(offsetX)}px, ${clamp(offsetY)}px)`;
    };

    const handleMouseLeave = () => {
        if (ref.current) ref.current.style.transform = "translate(0, 0)";
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 ease-out ${className}`}
        >
            {children}
        </div>
    );
};
