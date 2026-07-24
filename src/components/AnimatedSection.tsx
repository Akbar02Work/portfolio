import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => {
  const { ref, isVisible, reduceMotion, skipTransition } = useScrollAnimation({
    rootMargin: "0px 0px 200px 0px",
  });

  return (
    <div
      ref={ref}
      className={`${reduceMotion || skipTransition ? "transition-none" : "transition-transform duration-700 ease-out"} ${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        transitionDelay: reduceMotion || skipTransition ? "0ms" : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
