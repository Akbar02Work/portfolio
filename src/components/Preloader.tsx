import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  onDone: () => void;
};

export function Preloader({ onDone }: Props) {
  const [count, setCount] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.classList.add("is-loading");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCount(100);
      document.body.classList.remove("is-loading");
      onDone();
      return;
    }

    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (doneRef.current) return;
        doneRef.current = true;
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.95,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.classList.remove("is-loading");
            onDone();
          },
        });
      },
    });

    tl.to(obj, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(obj.v));
        if (fillRef.current) fillRef.current.style.width = `${obj.v}%`;
      },
    });

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div className="preloader" ref={rootRef} aria-hidden={count >= 100}>
      <div className="preloader__inner">
        <p className="preloader__label">Booting signal // portfolio lab</p>
        <p className="preloader__count">
          {String(count).padStart(2, "0")}
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
