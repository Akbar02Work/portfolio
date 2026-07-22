import { useEffect, useRef } from "react";

const SECTIONS = [
  { id: "top", label: "00" },
  { id: "works", label: "02" },
  { id: "about", label: "03" },
  { id: "contact", label: "04" },
] as const;

type Props = {
  onJump: (id: string) => void;
};

export function SectionDots({ onJump }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-sec]"));

    const observers = SECTIONS.map((section, index) => {
      const el = document.getElementById(section.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          buttons.forEach((btn, i) => {
            btn.classList.toggle("is-active", i === index);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="section-dots" ref={rootRef} aria-label="Section navigation">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          className="section-dots__btn"
          data-sec={section.id}
          data-cursor="hover"
          data-cursor-label={section.label}
          aria-label={`Go to ${section.id}`}
          onClick={() => onJump(section.id)}
        >
          <span className="section-dots__mark" />
          <span className="section-dots__label">{section.label}</span>
        </button>
      ))}
    </div>
  );
}
