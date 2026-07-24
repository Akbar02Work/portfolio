import { useEffect, useRef } from "react";
import { SECTIONS } from "../siteData";

type Props = {
  onJump: (id: string) => void;
};

/**
 * Unified right-rail: section stops sit on a shared spine,
 * scroll fill travels through them, readout lives at the foot.
 */
export function ScrollNav({ onJump }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-sec]"));
    const sectionEls = SECTIONS.map((section) => document.getElementById(section.id));
    const lastIndex = Math.max(1, SECTIONS.length - 1);

    let raf = 0;
    let lastProgress = -1;
    let lastActive = -1;

    const update = () => {
      raf = 0;
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--scroll")
        .trim();
      const progress = Math.min(1, Math.max(0, Number(raw) || 0));

      // Active = last section whose top has crossed the upper probe.
      // Works for short sections (01 Manifesto) when scrolling up or down.
      const probe = window.innerHeight * 0.32;
      let active = 0;
      for (let i = 0; i < sectionEls.length; i++) {
        const el = sectionEls[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) active = i;
      }

      if (active !== lastActive) {
        lastActive = active;
        buttons.forEach((btn, i) => {
          btn.classList.toggle("is-active", i === active);
        });
      }

      if (Math.abs(progress - lastProgress) > 0.0008) {
        lastProgress = progress;

        if (fillRef.current) {
          fillRef.current.style.transform = `scaleY(${progress})`;
        }
        if (headRef.current) {
          headRef.current.style.top = `${progress * 100}%`;
          headRef.current.style.opacity = progress > 0.02 && progress < 0.98 ? "1" : "0";
        }

        const passed = progress * lastIndex;
        buttons.forEach((btn, i) => {
          btn.classList.toggle("is-passed", i <= passed + 0.02);
        });
      }

    };

    const scheduleUpdate = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <nav className="scroll-nav" ref={rootRef} aria-label="Section navigation">
      <div className="scroll-nav__body">
        <div className="scroll-nav__spine" aria-hidden="true">
          <div className="scroll-nav__rail">
            <div className="scroll-nav__fill" ref={fillRef} />
            <span className="scroll-nav__head" ref={headRef} />
          </div>
        </div>

        <ol className="scroll-nav__stops">
          {SECTIONS.map((section) => (
            <li key={section.id} className="scroll-nav__stop">
              <button
                type="button"
                className="scroll-nav__btn"
                data-sec={section.id}
                data-cursor="hover"
                data-cursor-label={section.label}
                aria-label={`Go to ${section.name}`}
                onClick={() => onJump(section.id)}
              >
                <span className="scroll-nav__meta">
                  <span className="scroll-nav__index">{section.label}</span>
                  <span className="scroll-nav__name">{section.name}</span>
                </span>
                <span className="scroll-nav__node" aria-hidden="true">
                  <span className="scroll-nav__node-core" />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
