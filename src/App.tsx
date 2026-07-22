import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Corners } from "./components/Corners";
import { Cursor } from "./components/Cursor";
import { Preloader } from "./components/Preloader";
import { ScrollRail } from "./components/ScrollRail";
import { SectionDots } from "./components/SectionDots";
import { ShaderCanvas } from "./components/ShaderCanvas";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "voicenotes",
    index: "01",
    name: "VoiceNotes",
    glyph: "VN",
    year: "2025",
    role: "Android · AI",
    desc: "Voice capture that becomes structured, searchable notes — Gemini summarization with offline-first Room storage.",
    tags: ["Kotlin", "Compose", "Gemini", "Room", "Clean Arch"],
    href: "https://github.com/Akbar02Work/VoiceNotes",
  },
  {
    id: "secbench",
    index: "02",
    name: "SecBench-25",
    glyph: "SB",
    year: "2025",
    role: "LLM · Security",
    desc: "Repeatable jailbreak benchmarking for LLM systems — attack suites, defense layers, evidence-grade reports.",
    tags: ["Python", "LangChain", "OpenAI", "Pytest"],
    href: "https://github.com/Akbar02Work/secbench-25",
  },
  {
    id: "signal",
    index: "03",
    name: "This Lab",
    glyph: "110",
    year: "2026",
    role: "Web · Craft",
    desc: "An experimental signal surface — WebGL atmosphere, kinetic type, pinned storytelling. Proof that craft is part of the product.",
    tags: ["React", "GSAP", "Lenis", "WebGL"],
    href: "#top",
  },
] as const;

const STACK = [
  "Kotlin",
  "Jetpack Compose",
  "Gemini",
  "OpenAI",
  "Clean Architecture",
  "Room",
  "Hilt",
  "Coroutines",
  "Offline-first",
  "LLM → Features",
] as const;

function useTashkentClock() {
  const [text, setText] = useState("");

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tashkent",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setText(time);
    };
    fmt();
    const id = window.setInterval(fmt, 1000);
    return () => window.clearInterval(id);
  }, []);

  return text;
}

function useBlink(ms = 530) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = window.setInterval(() => setOn((v) => !v), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return on;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const clock = useTashkentClock();
  const blink = useBlink();

  const onPreloaderDone = useCallback(() => setReady(true), []);

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

  useEffect(() => {
    if (!ready) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopPin = window.matchMedia("(min-width: 860px)").matches;
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        lerp: 0.075,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.15,
        smoothWheel: true,
        syncTouch: false,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      gsap.set(".nav", { opacity: 1 });
      gsap.from(".nav", {
        y: -24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.05,
      });

      gsap.from(".scroll-rail, .section-dots, .lab-stamp", {
        opacity: 0,
        duration: 0.8,
        delay: 0.55,
        ease: "power2.out",
      });

      gsap.fromTo(
        ".hero__line span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.08,
          clearProps: "transform",
        },
      );

      gsap.from([".hero__meta", ".hero__clock", ".hero__bottom", ".hero__index"], {
        opacity: 0,
        y: 20,
        duration: 0.95,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.4,
        clearProps: "all",
      });

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

      // Card hover parallax (desktop)
      if (!reduced && window.matchMedia("(hover: hover)").matches) {
        gsap.utils.toArray<HTMLElement>(".work-card__panel").forEach((panel) => {
          const glow = panel.querySelector<HTMLElement>(".work-card__glow");
          const glyph = panel.querySelector<HTMLElement>(".work-card__glyph");

          const onMove = (e: MouseEvent) => {
            const rect = panel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(panel, {
              rotateX: y * -4,
              rotateY: x * 5,
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
        });
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
      }

      const track = document.querySelector<HTMLElement>(".works__track");
      const pin = document.querySelector<HTMLElement>(".works__pin");
      if (track && pin && desktopPin && !reduced) {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });
      }

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
      ctx.revert();
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onDone={onPreloaderDone} />}
      <ShaderCanvas scrollRef={scrollProgressRef} />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Cursor />
      {ready && (
        <>
          <ScrollRail />
          <SectionDots onJump={scrollToId} />
          <p className="lab-stamp" aria-hidden="true">
            <span>Signal Lab</span>
            <span>v0.2</span>
            <span>2026</span>
          </p>
        </>
      )}

      <div className="site" id="top">
        <header className="nav">
          <a
            className="nav__brand"
            href="#top"
            data-cursor="hover"
            data-cursor-label="Home"
            onClick={(e) => onNavClick(e, "top")}
          >
            aka
            <em className={blink ? "is-on" : "is-off"}>_</em>
            /signal
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a
              href="#works"
              className="nav__link"
              data-cursor="hover"
              data-cursor-label="02"
              onClick={(e) => onNavClick(e, "works")}
            >
              Works
            </a>
            <a
              href="#about"
              className="nav__link"
              data-cursor="hover"
              data-cursor-label="03"
              onClick={(e) => onNavClick(e, "about")}
            >
              About
            </a>
            <a
              href="#contact"
              className="nav__link"
              data-cursor="hover"
              data-cursor-label="04"
              onClick={(e) => onNavClick(e, "contact")}
            >
              Contact
            </a>
          </nav>
          <p className="nav__status">
            <span className="nav__status-dot" aria-hidden="true" />
            Open to remote
          </p>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero__frame" aria-hidden="true">
              <Corners />
            </div>

            <p className="hero__index">
              <b>00</b> / Intro
              <span className="draw-line" data-draw />
            </p>

            <div className="hero__top">
              <p className="hero__meta">
                Android &amp; AI engineer turning raw models into product features —
                offline-first, production-shaped, obsessively finished.
              </p>
              <div className="hero__clock">
                <span className="hero__clock-dot" aria-hidden="true" />
                <span className="hero__clock-time">{clock || "—:—:—"}</span>
                <span className="hero__clock-zone">Tashkent · UTC+5</span>
              </div>
            </div>

            <h1 className="hero__title" id="hero-title">
              <span className="hero__line">
                <span>Akbar</span>
              </span>
              <span className="hero__line hero__line--accent">
                <span>builds</span>
              </span>
              <span className="hero__line hero__line--signal">
                <span>signal</span>
              </span>
            </h1>

            <div className="hero__bottom">
              <a
                className="hero__cta"
                href="#works"
                data-cursor="hover"
                data-cursor-label="Enter"
                onClick={(e) => onNavClick(e, "works")}
              >
                <span className="hero__cta-mark" aria-hidden="true">
                  ↓
                </span>
                <span className="hero__cta-text">
                  <span>Enter selected works</span>
                </span>
              </a>
              <p className="hero__scroll">
                <span className="hero__scroll-line" aria-hidden="true" />
                Scroll to feel the system
              </p>
            </div>
          </section>

          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {Array.from({ length: 2 }).map((_, copy) => (
                <div key={copy} className="marquee__group">
                  {STACK.map((item) => (
                    <span key={`${copy}-${item}`}>{item}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <section className="section manifesto" aria-labelledby="manifesto-title">
            <p className="section__index">
              <b>01</b> / Manifesto
              <span className="draw-line" data-draw />
            </p>
            <h2 className="sr-only" id="manifesto-title">
              Manifesto
            </h2>
            <p className="manifesto__text">
              <span>If it ships,</span> <span>it should</span> <span>feel</span>{" "}
              <span>
                <em>inevitable.</em>
              </span>
            </p>
            <p className="manifesto__aside" data-reveal>
              Most portfolios explain. This one performs. Same bar I hold for Android
              products: clarity under pressure, motion with purpose, zero dead pixels of
              intention.
            </p>
          </section>

          <section className="section works" id="works" aria-labelledby="works-title">
            <div className="works__head" data-reveal>
              <div>
                <p className="section__index">
                  <b>02</b> / Selected works
                  <span className="draw-line" data-draw />
                </p>
                <h2 className="works__title" id="works-title">
                  Proof
                  <br />
                  over noise
                </h2>
              </div>
              <p className="eyebrow works__hint">
                <span className="works__hint-count">03</span> cases · scroll to travel →
              </p>
            </div>

            <div className="works__pin">
              <div className="works__track">
                {PROJECTS.map((project) => (
                  <article
                    key={project.id}
                    className={`work-card work-card--${project.id}`}
                  >
                    <div className="work-card__panel">
                      <Corners className="work-card__corners" />
                      <div className="work-card__glow" aria-hidden="true" />

                      <div className="work-card__chrome" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <p>
                          {project.role} · {project.year}
                        </p>
                      </div>

                      <div className="work-card__visual" aria-hidden="true">
                        <span className="work-card__glyph">{project.glyph}</span>
                        <span className="work-card__grid" />
                      </div>

                      <div className="work-card__meta">
                        <p className="work-card__index">
                          {project.index} / Case
                          <span className="work-card__coords">
                            [{project.id.slice(0, 3).toUpperCase()}]
                          </span>
                        </p>
                        <h3 className="work-card__name">{project.name}</h3>
                        <p className="work-card__desc">{project.desc}</p>
                        <div className="work-card__tags">
                          {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <a
                          className="work-card__link"
                          href={project.href}
                          target={project.href.startsWith("http") ? "_blank" : undefined}
                          rel={
                            project.href.startsWith("http")
                              ? "noreferrer noopener"
                              : undefined
                          }
                          data-cursor="hover"
                          data-cursor-label="Open"
                          onClick={
                            project.href === "#top"
                              ? (e) => onNavClick(e, "top")
                              : undefined
                          }
                        >
                          Open case ↗
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section about" id="about" aria-labelledby="about-title">
            <p className="section__index" data-reveal>
              <b>03</b> / About
              <span className="draw-line" data-draw />
            </p>
            <div className="about__grid">
              <div className="about__portrait" data-reveal data-cursor="hover" data-cursor-label="Akbar">
                <Corners className="about__portrait-corners" />
                <div className="about__portrait-glow" aria-hidden="true" />
                <div className="about__portrait-chrome" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <p>ID · AKBAR · TASHKENT</p>
                </div>
                <div className="about__portrait-frame">
                  <img
                    className="about__portrait-img"
                    src="/avatar.png"
                    srcSet="/avatar-320.png 320w, /avatar-480.png 480w, /avatar.png 586w"
                    sizes="(min-width: 860px) 320px, 70vw"
                    width={586}
                    height={934}
                    alt="Akbar Azizov"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <div className="about__portrait-fade" aria-hidden="true" />
                </div>
                <p className="about__portrait-meta">
                  <span>Fig. 01</span>
                  <span>Android &amp; AI Engineer</span>
                </p>
              </div>

              <div className="about__content">
                <h2 className="about__lead" id="about-title" data-reveal>
                  I turn AI models into <em>real Android features</em> — not demos, not
                  slides.
                </h2>
                <div className="about__copy" data-reveal>
                  <p>
                    Based in Tashkent. Building with Kotlin, Jetpack Compose, and practical
                    LLM integration — structured outputs, offline resilience, clean
                    architecture that survives production.
                  </p>
                  <p>
                    This lab exists because the website should feel like the work: sharp,
                    intentional, a little impossible.
                  </p>
                </div>
              </div>
            </div>
            <div className="stats" data-reveal>
              <div className="stat">
                <p className="stat__value">110%</p>
                <p className="stat__label">Finish standard</p>
                <span className="stat__tick" aria-hidden="true" />
              </div>
              <div className="stat">
                <p className="stat__value">AI × OS</p>
                <p className="stat__label">Core focus</p>
                <span className="stat__tick" aria-hidden="true" />
              </div>
              <div className="stat">
                <p className="stat__value">Remote</p>
                <p className="stat__label">Available now</p>
                <span className="stat__tick" aria-hidden="true" />
              </div>
            </div>
          </section>

          <section
            className="section contact"
            id="contact"
            aria-labelledby="contact-title"
          >
            <p className="section__index" data-reveal>
              <b>04</b> / Contact
              <span className="draw-line" data-draw />
            </p>
            <h2 className="contact__title" id="contact-title" data-reveal>
              Let’s make
              <br />
              something <em>loud.</em>
            </h2>
            <a
              className="contact__email"
              href="mailto:akbar02work@gmail.com"
              data-cursor="hover"
              data-cursor-label={emailCopied ? "Done" : "Copy"}
              data-reveal
              onClick={copyEmail}
            >
              {emailCopied ? "Copied to clipboard ✓" : "akbar02work@gmail.com"}
            </a>
            <p className="contact__email-hint" data-reveal>
              Click to copy · ⌘/Ctrl+click to open mail
            </p>
            <div className="contact__row" data-reveal>
              <div className="contact__socials">
                <a
                  href="https://t.me/Akbar02Work"
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  data-cursor-label="TG"
                >
                  <span className="contact__bracket">[</span>
                  Telegram
                  <span className="contact__bracket">]</span>
                </a>
                <a
                  href="https://github.com/Akbar02Work"
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  data-cursor-label="GH"
                >
                  <span className="contact__bracket">[</span>
                  GitHub
                  <span className="contact__bracket">]</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/akbar02work"
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  data-cursor-label="IN"
                >
                  <span className="contact__bracket">[</span>
                  LinkedIn
                  <span className="contact__bracket">]</span>
                </a>
              </div>
              <p className="contact__credit">
                Designed &amp; engineered by Akbar — Signal Lab · {new Date().getFullYear()}
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
