import { useEffect, useRef } from "react";

/** Side scroll rail + percentage — updates via CSS var / textContent (no React re-render). */
export function ScrollRail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;

    const tick = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--scroll")
        .trim();
      const progress = Number(raw) || 0;
      if (Math.abs(progress - last) > 0.001) {
        last = progress;
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleY(${progress})`;
        }
        if (pctRef.current) {
          pctRef.current.textContent = `${String(Math.round(progress * 100)).padStart(2, "0")}`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-rail__track">
        <div className="scroll-rail__fill" ref={fillRef} />
      </div>
      <span className="scroll-rail__pct">
        <span ref={pctRef}>00</span>
        <small>%</small>
      </span>
    </div>
  );
}
