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
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-500 ${className} ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

