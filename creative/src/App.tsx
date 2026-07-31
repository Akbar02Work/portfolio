import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Cursor } from "./components/Cursor";
import { PortfolioPage } from "./components/PortfolioPage";
import { Preloader } from "./components/Preloader";
import { ScrollNav } from "./components/ScrollNav";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { getBusinessUrl } from "./siteConfig";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MEDIA_QUERY = "(min-width: 901px)";

function useDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" || window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const sync = () => setIsDesktop(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}

function DesktopOnlyGate() {
  useLayoutEffect(() => {
    document.body.classList.remove("is-loading");
    document.getElementById("boot-curtain")?.remove();
  }, []);

  return (
    <main className="desktop-gate" aria-labelledby="desktop-gate-title">
      <div className="desktop-gate__grid" aria-hidden="true" />
      <p className="desktop-gate__eyebrow">00 / Access denied</p>
      <h1 id="desktop-gate-title">Обломись.</h1>
      <p className="desktop-gate__copy">
        Creative открывается только с версии для ПК.
      </p>
      <a className="desktop-gate__link" href={getBusinessUrl()}>
        Вернуться в Business <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
}

function DesktopExperience() {
  const [ready, setReady] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [booting, setBooting] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  const onPreloaderReady = useCallback(() => {
    flushSync(() => setReady(true));
  }, []);
  const onPreloaderReveal = useCallback(() => setReveal(true), []);
  const onPreloaderExit = useCallback(() => setBooting(false), []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.35 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const onNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      scrollToId(id);
    },
    [scrollToId],
  );

  const copyEmail = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("akbar02work@gmail.com");
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      window.location.href = "mailto:akbar02work@gmail.com";
    }
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    const interactionCleanups: Array<() => void> = [];
    const responsive = gsap.matchMedia();

    responsive.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        lenis = new Lenis({
          lerp: 0.075,
          wheelMultiplier: 0.9,
          smoothWheel: true,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);

        ticker = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        return () => {
          if (ticker) gsap.ticker.remove(ticker);
          lenis?.destroy();
          lenis = null;
          ticker = null;
          lenisRef.current = null;
        };
      },
    );

    const ctx = gsap.context(() => {
      // Lock intro in the "from" pose under the curtain (played on reveal).
      gsap.set(".nav", { opacity: 0, y: -24 });
      gsap.set(".hero__line span", { yPercent: 110 });
      gsap.set([".hero__meta", ".hero__bottom", ".hero__index"], {
        opacity: 0,
        y: 20,
      });
      const scrollNav = document.querySelector(".scroll-nav");
      if (scrollNav) gsap.set(scrollNav, { opacity: 0 });

      // Draw section index underlines
      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            clearProps: "transform",
          },
        );
      });

      const manifestoWords = gsap.utils.toArray<HTMLElement>(".manifesto__text span");
      if (manifestoWords.length) {
        if (reduced) {
          gsap.set(manifestoWords, { opacity: 1 });
        } else {
          gsap.fromTo(
            manifestoWords,
            { opacity: 0.15 },
            {
              opacity: 1,
              stagger: 0.06,
              ease: "none",
              scrollTrigger: {
                trigger: ".manifesto",
                start: "top 75%",
                end: "center 45%",
                scrub: 0.4,
              },
            },
          );
        }
      }

      // Card + portrait hover parallax (desktop)
      if (!reduced && window.matchMedia("(hover: hover)").matches) {
        gsap.utils.toArray<HTMLElement>(".work-card__panel").forEach((panel) => {
          const glow = panel.querySelector<HTMLElement>(".work-card__glow");
          const glyph = panel.querySelector<HTMLElement>(".work-card__glyph");

          const onMove = (e: MouseEvent) => {
            const rect = panel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(panel, {
              rotateX: y * -2.5,
              rotateY: x * 3,
              transformPerspective: 900,
              duration: 0.45,
              ease: "power2.out",
            });
            if (glow) {
              gsap.to(glow, { x: x * 40, y: y * 30, duration: 0.45 });
            }
            if (glyph) {
              gsap.to(glyph, { x: x * 18, y: y * 12, duration: 0.45 });
            }
          };

          const onLeave = () => {
            gsap.to(panel, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.6,
              ease: "power3.out",
            });
            if (glow) gsap.to(glow, { x: 0, y: 0, duration: 0.6 });
            if (glyph) gsap.to(glyph, { x: 0, y: 0, duration: 0.6 });
          };

          panel.addEventListener("mousemove", onMove);
          panel.addEventListener("mouseleave", onLeave);
          interactionCleanups.push(() => {
            panel.removeEventListener("mousemove", onMove);
            panel.removeEventListener("mouseleave", onLeave);
          });
        });

        const portrait = document.querySelector<HTMLElement>(".about__portrait");
        if (portrait) {
          const glow = portrait.querySelector<HTMLElement>(".about__portrait-glow");

          const onMove = (e: MouseEvent) => {
            const rect = portrait.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(portrait, {
              rotateX: y * -7,
              rotateY: x * 9,
              transformPerspective: 1000,
              duration: 0.4,
              ease: "power2.out",
            });
            if (glow) {
              gsap.to(glow, { x: x * 55, y: y * 40, duration: 0.4 });
            }
          };

          const onLeave = () => {
            gsap.to(portrait, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.7,
              ease: "power3.out",
            });
            if (glow) gsap.to(glow, { x: 0, y: 0, duration: 0.7 });
          };

          portrait.addEventListener("mousemove", onMove);
          portrait.addEventListener("mouseleave", onLeave);
          interactionCleanups.push(() => {
            portrait.removeEventListener("mousemove", onMove);
            portrait.removeEventListener("mouseleave", onLeave);
          });
        }
      }

      // Magnetic CTA
      const cta = document.querySelector<HTMLElement>(".hero__cta");
      if (cta && !reduced && window.matchMedia("(hover: hover)").matches) {
        const onMove = (e: MouseEvent) => {
          const rect = cta.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          gsap.to(cta, { x: x * 0.22, y: y * 0.28, duration: 0.35, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(cta, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
        };
        cta.addEventListener("mousemove", onMove);
        cta.addEventListener("mouseleave", onLeave);
        interactionCleanups.push(() => {
          cta.removeEventListener("mousemove", onMove);
          cta.removeEventListener("mouseleave", onLeave);
        });
      }

      responsive.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const track = document.querySelector<HTMLElement>(".works__track");
          const pin = document.querySelector<HTMLElement>(".works__pin");
          if (!track || !pin) return;
          const cards = gsap.utils.toArray<HTMLElement>(".work-card");

          const getStartX = () => {
            const card = cards[0];
            if (!card) return 0;
            return pin.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
          };

          const getEndX = () => {
            const card = cards[cards.length - 1];
            if (!card) return getStartX();
            return pin.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
          };

          const getTravel = () => Math.max(0, getStartX() - getEndX());
          // Vertical slack while first project stays magnetized to center
          const getHold = () => Math.round(window.innerHeight * 0.42);

          const updateCardFocus = () => {
            const pinRect = pin.getBoundingClientRect();
            const focusX = pinRect.left + pinRect.width * 0.5;
            cards.forEach((card) => {
              const rect = card.getBoundingClientRect();
              const cardMid = rect.left + rect.width / 2;
              const t = Math.min(1, Math.abs(cardMid - focusX) / (pinRect.width * 0.7));
              gsap.set(card, {
                opacity: 1 - t * 0.62,
                scale: 1 - t * 0.1,
                filter: `blur(${(t * 2.4).toFixed(2)}px)`,
              });
            });
          };

          const applyTrackX = (progress: number) => {
            const hold = getHold();
            const travel = getTravel();
            const total = Math.max(1, hold + travel);
            const holdRatio = hold / total;
            const startX = getStartX();
            const endX = getEndX();

            if (progress <= holdRatio) {
              gsap.set(track, { x: startX });
            } else {
              const t = (progress - holdRatio) / Math.max(0.0001, 1 - holdRatio);
              gsap.set(track, { x: gsap.utils.interpolate(startX, endX, t) });
            }
            updateCardFocus();
          };

          gsap.set(track, { x: getStartX() });
          updateCardFocus();

          ScrollTrigger.create({
            trigger: pin,
            start: "top top",
            end: () => `+=${getHold() + getTravel()}`,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            onUpdate: (self) => applyTrackX(self.progress),
            onRefresh: (self) => applyTrackX(self.progress),
          });
        },
      );

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          document.documentElement.style.setProperty(
            "--scroll",
            self.progress.toFixed(4),
          );
        },
      });

      ScrollTrigger.create({
        start: "top -40",
        onEnter: () => document.querySelector(".nav")?.classList.add("is-scrolled"),
        onLeaveBack: () =>
          document.querySelector(".nav")?.classList.remove("is-scrolled"),
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const refreshTimers = [100, 400, 900].map((ms) =>
      window.setTimeout(() => ScrollTrigger.refresh(), ms),
    );

    return () => {
      refreshTimers.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
      interactionCleanups.forEach((cleanup) => cleanup());
      responsive.revert();
      ctx.revert();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]);

  // Visible intro starts only after the curtain has fully cleared.
  useLayoutEffect(() => {
    if (!reveal) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(".nav", { opacity: 1, y: 0 });
      gsap.set(".hero__line span", { yPercent: 0 });
      gsap.set([".hero__meta", ".hero__bottom", ".hero__index"], {
        opacity: 1,
        y: 0,
      });
      const scrollNav = document.querySelector(".scroll-nav");
      if (scrollNav) gsap.set(scrollNav, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      const scrollNav = document.querySelector(".scroll-nav");

      intro
        .to(
          ".nav",
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            clearProps: "transform",
          },
          0,
        )
        .to(
          ".hero__line span",
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: "power4.out",
            clearProps: "transform",
          },
          0.04,
        )
        .to(
          [".hero__meta", ".hero__bottom", ".hero__index"],
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.05,
            clearProps: "transform",
          },
          0.22,
        );

      if (scrollNav) {
        intro.to(
          scrollNav,
          {
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
          },
          0.28,
        );
      }
    });

    return () => ctx.revert();
  }, [reveal]);

  return (
    <>
      {booting && (
        <Preloader
          onReady={onPreloaderReady}
          onReveal={onPreloaderReveal}
          onExitComplete={onPreloaderExit}
        />
      )}
      <ShaderCanvas scrollRef={scrollProgressRef} />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Cursor />
      {ready && <ScrollNav onJump={scrollToId} />}

      <PortfolioPage
        ready={ready}
        reveal={reveal}
        emailCopied={emailCopied}
        onCopyEmail={copyEmail}
        onNavClick={onNavClick}
      />
    </>
  );
}

export default function App() {
  const isDesktop = useDesktopViewport();
  return isDesktop ? <DesktopExperience /> : <DesktopOnlyGate />;
}
