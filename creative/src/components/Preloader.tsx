import { useEffect, useRef } from "react";
import gsap from "gsap";

const PRELOADER_SEEN_KEY = "signal-preloader-seen";

function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem(PRELOADER_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    window.sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

type Props = {
  /** Arm intro poses while the curtain still covers the page. */
  onReady: () => void;
  /** Curtain cleared — play the visible intro. */
  onReveal: () => void;
  /** Safe to unmount the preloader. */
  onExitComplete: () => void;
};

export function Preloader({ onReady, onReveal, onExitComplete }: Props) {
  const countRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.classList.add("is-loading");
    const updateCount = (value: number) => {
      const text = String(Math.round(value)).padStart(2, "0");
      if (countRef.current && countRef.current.textContent !== text) countRef.current.textContent = text;
      if (value >= 100) rootRef.current?.setAttribute("aria-hidden", "true");
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || hasSeenPreloader()) {
      updateCount(100);
      document.body.classList.remove("is-loading");
      document.getElementById("boot-curtain")?.remove();
      onReady();
      const revealFrame = window.requestAnimationFrame(() => {
        onReveal();
        onExitComplete();
      });
      return () => window.cancelAnimationFrame(revealFrame);
    }

    let cancelled = false;
    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (doneRef.current || cancelled) return;
        doneRef.current = true;
        markPreloaderSeen();

        // Pose intro under the curtain, then lift — unlock scroll as soon as exit starts.
        onReady();

        gsap.delayedCall(0.04, () => {
          if (cancelled) return;
          document.body.classList.remove("is-loading");
          gsap.to(rootRef.current, {
            yPercent: -100,
            duration: 0.58,
            ease: "power4.inOut",
            onComplete: () => {
              if (cancelled) return;
              document.getElementById("boot-curtain")?.remove();
              onReveal();
              gsap.delayedCall(0.02, onExitComplete);
            },
          });
        });
      },
    });

    tl.to(obj, {
      v: 100,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => {
        updateCount(obj.v);
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${obj.v / 100})`;
      },
    });

    return () => {
      cancelled = true;
      tl.kill();
      document.body.classList.remove("is-loading");
    };
  }, [onReady, onReveal, onExitComplete]);

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader__inner">
        <p className="preloader__label">Booting signal // portfolio lab</p>
        <p className="preloader__count">
          <span ref={countRef}>00</span>
          <span>%</span>
        </p>
        <div className="preloader__bar" aria-hidden="true">
          <div className="preloader__bar-fill" ref={fillRef} />
        </div>
        <p className="preloader__hint">Craft first. Then ship.</p>
      </div>
    </div>
  );
}
