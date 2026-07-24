import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SECTIONS } from "../siteData";

type Props = {
  onJump: (id: string) => void;
};

export function MobileIndex({ onJump }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const sectionEls = SECTIONS.map((section) => document.getElementById(section.id));
    const probe = window.innerHeight * 0.32;
    let next = 0;
    for (let i = 0; i < sectionEls.length; i++) {
      const el = sectionEls[i];
      if (!el) continue;
      if (el.getBoundingClientRect().top <= probe) next = i;
    }
    setActive(next);

    const prevOverflow = document.body.style.overflow;
    const site = document.querySelector<HTMLElement>(".site");
    const trigger = triggerRef.current;
    const previousAriaHidden = site?.getAttribute("aria-hidden") ?? null;
    const hadInert = site?.hasAttribute("inert") ?? false;
    document.body.style.overflow = "hidden";
    document.body.classList.add("is-index-open");
    site?.setAttribute("aria-hidden", "true");
    site?.setAttribute("inert", "");
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("is-index-open");
      window.removeEventListener("keydown", onKey);
      if (previousAriaHidden === null) site?.removeAttribute("aria-hidden");
      else site?.setAttribute("aria-hidden", previousAriaHidden);
      if (!hadInert) site?.removeAttribute("inert");
      trigger?.focus();
    };
  }, [open]);

  const jump = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => onJump(id));
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`mobile-index__trigger${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        Index
      </button>

      {open &&
        createPortal(
          <div
            ref={rootRef}
            className="mobile-index"
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Section index"
          >
            <div className="mobile-index__backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
            <div className="mobile-index__panel">
              <div className="mobile-index__bar">
                <p className="mobile-index__eyebrow">
                  <b>00–04</b> / Index
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  className="mobile-index__close"
                  aria-label="Close index"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <ol className="mobile-index__list">
                {SECTIONS.map((section, i) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={`mobile-index__link${i === active ? " is-active" : ""}`}
                      onClick={() => jump(section.id)}
                    >
                      <span className="mobile-index__num">{section.label}</span>
                      <span className="mobile-index__name">{section.name}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
