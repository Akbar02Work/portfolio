import { useEffect, useRef } from "react";

/**
 * Custom cursor: both dot and ring live in screen space.
 * Ring lags via lerp — never double-counts parent transforms.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (coarse) return;

    const root = rootRef.current;
    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    const labelEl = labelRef.current;
    if (!root || !dotEl || !ringEl || !labelEl) return;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Dot sticks to the pointer immediately
      dotEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      const hoverable = el?.closest<HTMLElement>("a, button, [data-cursor='hover']");
      const label = hoverable?.dataset.cursorLabel?.trim() ?? "";
      root.classList.toggle("is-hover", Boolean(hoverable));
      root.classList.toggle("has-label", Boolean(label));
      labelEl.textContent = label;
    };

    const tick = () => {
      // Soft follow — small lag, always in the same coordinate space as the dot
      ring.current.x += (target.current.x - ring.current.x) * 0.22;
      ring.current.y += (target.current.y - ring.current.y) * 0.22;
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);
    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className="cursor__dot" ref={dotRef} />
      <div className="cursor__ring" ref={ringRef}>
        <span className="cursor__label" ref={labelRef} />
      </div>
    </div>
  );
}
