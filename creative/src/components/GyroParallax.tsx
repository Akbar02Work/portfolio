import { useEffect } from "react";
import gsap from "gsap";

type Props = {
  active: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function shouldRun() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const fineDesktop =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(pointer: coarse)").matches &&
    !("ontouchstart" in window);
  return !fineDesktop;
}

/**
 * Tilt parallax for work cards + about portrait.
 * deviceorientation + devicemotion (gravity) fallback for Android Chrome.
 * Chrome requires HTTPS (or localhost) — http://192.168.x is blocked.
 */
export function GyroParallax({ active }: Props) {
  useEffect(() => {
    if (!active || !shouldRun()) return;

    const insecure = !window.isSecureContext;
    if (insecure) {
      console.warn(
        "[GyroParallax] Chrome blocks sensors on HTTP LAN. Open the https:// URL from `npm run dev`.",
      );
    }
    const orientationApi = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<PermissionState>;
        })
      | undefined;
    // Permission-gated sensors must be enabled by an explicit UI, never by a surprise first tap.
    if (!orientationApi || typeof orientationApi.requestPermission === "function") return;

    let useMotion = true;
    let originX = 0;
    let originY = 0;
    let calibrated = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    let gotSample = false;
    let listening = false;

    const visibility = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom <= 0 || rect.top >= vh) return 0;
      const mid = (rect.top + rect.bottom) / 2;
      const dist = Math.abs(mid - vh * 0.42) / vh;
      return clamp(1 - dist * 1.2, 0, 1);
    };

    const setTilt = (x: number, y: number) => {
      if (!calibrated) {
        originX = x;
        originY = y;
        calibrated = true;
      }
      targetX = clamp(x - originX, -1, 1);
      targetY = clamp(y - originY, -1, 1);
      gotSample = true;
    };

    const onOrient = (event: DeviceOrientationEvent) => {
      if (event.beta == null && event.gamma == null) return;
      if (useMotion) {
        useMotion = false;
        calibrated = false; // switch space once
      }
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;
      setTilt(gamma / 14, beta / 18);
    };

    const onMotion = (event: DeviceMotionEvent) => {
      if (!useMotion) return;
      const g = event.accelerationIncludingGravity;
      if (!g || g.x == null || g.y == null) return;
      setTilt(g.x / 6.5, (g.y - 9.2) / 6.5);
    };

    const tick = () => {
      if (!listening) return;
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;

      document.querySelectorAll<HTMLElement>(".work-card__panel").forEach((panel) => {
        const glow = panel.querySelector<HTMLElement>(".work-card__glow");
        const glyph = panel.querySelector<HTMLElement>(".work-card__glyph");
        const v = visibility(panel);

        if (v <= 0.02) {
          gsap.set(panel, { rotateX: 0, rotateY: 0 });
          if (glow) gsap.set(glow, { x: 0, y: 0 });
          if (glyph) gsap.set(glyph, { x: 0, y: 0 });
          return;
        }

        gsap.set(panel, {
          rotateX: curY * -7 * v,
          rotateY: curX * 9 * v,
          transformPerspective: 900,
        });
        if (glow) gsap.set(glow, { x: curX * 42 * v, y: curY * 30 * v });
        if (glyph) gsap.set(glyph, { x: curX * 18 * v, y: curY * 12 * v });
      });

      const portrait = document.querySelector<HTMLElement>(".about__portrait");
      if (portrait) {
        const glow = portrait.querySelector<HTMLElement>(".about__portrait-glow");
        const img = portrait.querySelector<HTMLElement>(".about__portrait-img");
        const v = visibility(portrait);

        if (v <= 0.02) {
          gsap.set(portrait, { rotateX: 0, rotateY: 0 });
          if (glow) gsap.set(glow, { x: 0, y: 0 });
          if (img) gsap.set(img, { x: 0, y: 0, scale: 1 });
        } else {
          gsap.set(portrait, {
            rotateX: curY * -11 * v,
            rotateY: curX * 13 * v,
            transformPerspective: 1000,
          });
          if (glow) gsap.set(glow, { x: curX * 52 * v, y: curY * 36 * v });
          if (img) gsap.set(img, { x: curX * 12 * v, y: curY * 8 * v, scale: 1.05 });
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (listening || document.hidden) return;
      listening = true;
      window.addEventListener("deviceorientation", onOrient, true);
      window.addEventListener("devicemotion", onMotion, true);
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      listening = false;
      window.removeEventListener("deviceorientation", onOrient, true);
      window.removeEventListener("devicemotion", onMotion, true);
      cancelAnimationFrame(raf);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const warnTimer = window.setTimeout(() => {
      if (!gotSample && insecure) {
        console.warn("[GyroParallax] No sensor samples — open the https:// URL.");
      }
    }, 2500);

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearTimeout(warnTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, [active]);

  return null;
}
