import type { MouseEvent } from "react";
import { useBlink, useTashkentClock } from "../hooks/useSignalStatus";
import { withBase } from "../lib/urls";
import { getBusinessUrl } from "../siteConfig";
import { PROJECTS, STACK } from "../siteData";
import { Corners } from "./Corners";
import { FitWidthText } from "./FitWidthText";
import { VersionSwitch } from "./VersionSwitch";

type Props = {
  ready: boolean;
  reveal: boolean;
  emailCopied: boolean;
  onCopyEmail: (event: MouseEvent<HTMLAnchorElement>) => void;
  onNavClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

export function PortfolioPage({
  ready,
  reveal,
  emailCopied,
  onCopyEmail,
  onNavClick,
}: Props) {
  const clock = useTashkentClock();
  const blink = useBlink();
  const businessUrl = getBusinessUrl();

  return (
    <div className="site" id="top">
      <header className="nav">
        <a
          className="nav__brand"
          href="#top"
          data-cursor="hover"
          data-cursor-label="Home"
          onClick={(event) => onNavClick(event, "top")}
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
            onClick={(event) => onNavClick(event, "works")}
          >
            Works
          </a>
          <a
            href="#about"
            className="nav__link"
            data-cursor="hover"
            data-cursor-label="03"
            onClick={(event) => onNavClick(event, "about")}
          >
            About
          </a>
          <a
            href="#contact"
            className="nav__link"
            data-cursor="hover"
            data-cursor-label="04"
            onClick={(event) => onNavClick(event, "contact")}
          >
            Contact
          </a>
        </nav>
        <div className="nav__end">
          <VersionSwitch businessUrl={businessUrl} />
        </div>
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

          <p className="hero__meta">
            Android engineer at Market-R building native cashbox, retail, and
            transport systems — from architecture and APIs to offline recovery
            and release validation.
          </p>

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
              onClick={(event) => onNavClick(event, "works")}
            >
              <span className="hero__cta-mark" aria-hidden="true">
                ↓
              </span>
              <span className="hero__cta-text">
                <span>Enter selected works</span>
              </span>
            </a>
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

        <section
          className="section manifesto"
          id="manifesto"
          aria-labelledby="manifesto-title"
        >
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
            <p className="eyebrow works__hint works__hint--desktop">
              <span className="works__hint-count">
                {String(PROJECTS.length).padStart(2, "0")}
              </span>{" "}
              cases · scroll to travel →
            </p>
          </div>

          <div className="works__pin">
            <div className="works__track">
              {PROJECTS.map((project) => (
                <article key={project.id} className={`work-card work-card--${project.id}`}>
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
                            ? (event) => onNavClick(event, "top")
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
            <div
              className="about__portrait"
              data-reveal
              data-cursor="hover"
              data-cursor-label="Akbar"
            >
              <Corners className="about__portrait-corners" />
              <div className="about__portrait-glow" aria-hidden="true" />
              <div className="about__portrait-chrome" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>ID · AKBAR · TASHKENT</p>
              </div>
              <div className="about__portrait-frame">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${withBase("avatar-320.avif")} 320w, ${withBase("avatar-480.avif")} 480w, ${withBase("avatar.avif")} 586w`}
                    sizes="380px"
                  />
                  <source
                    type="image/webp"
                    srcSet={`${withBase("avatar-320.webp")} 320w, ${withBase("avatar-480.webp")} 480w, ${withBase("avatar.webp")} 586w`}
                    sizes="380px"
                  />
                  <img
                    className="about__portrait-img"
                    src={withBase("avatar.png")}
                    srcSet={`${withBase("avatar-320.png")} 320w, ${withBase("avatar-480.png")} 480w, ${withBase("avatar.png")} 586w`}
                    sizes="380px"
                    width={586}
                    height={934}
                    alt="Akbar Azizov"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </picture>
                <div className="about__portrait-fade" aria-hidden="true" />
              </div>
              <div className="about__portrait-meta">
                <div className="about__portrait-meta-copy">
                  <span>Fig. 01</span>
                  <span>Android Engineer · Product Builder</span>
                </div>
                <div className="about__portrait-clock">
                  <span className="about__portrait-clock-time">{clock || "—:—:—"}</span>
                  <span className="about__portrait-clock-zone">Tashkent · UTC+5</span>
                </div>
              </div>
            </div>

            <div className="about__content">
              <h2 className="about__lead" id="about-title" data-reveal>
                I build <em>native Android systems</em> that hold up in the real
                world.
              </h2>
              <div className="about__copy" data-reveal>
                <p>
                  At Market-R, I design and build two native Android apps for cashbox,
                  retail, and transport workflows — covering product design,
                  architecture, API integration, security, offline recovery, and
                  release validation.
                </p>
                <p>
                  I also founded Lumingo and built VoiceNotes, combining hands-on
                  engineering with end-to-end product ownership and practical AI
                  integration.
                </p>
              </div>
              <ul className="about__metrics" data-reveal>
                <li>
                  <span className="about__metric-value">2 native apps</span>
                  <span className="about__metric-label">Market-R systems</span>
                </li>
                <li>
                  <span className="about__metric-value">Founder</span>
                  <span className="about__metric-label">Lumingo</span>
                </li>
                <li>
                  <span className="about__metric-value">Solo build</span>
                  <span className="about__metric-label">VoiceNotes</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <p className="section__index" data-reveal>
            <b>04</b> / Contact
            <span className="draw-line" data-draw />
          </p>
          <h2 className="contact__title" id="contact-title" data-reveal>
            Let’s make
            <br />
            something
            <FitWidthText className="contact__loud" deps={[ready, reveal]}>
              loud.
            </FitWidthText>
          </h2>
          <a
            className="contact__email"
            href="mailto:akbar02work@gmail.com"
            data-cursor="hover"
            data-cursor-label={emailCopied ? "Done" : "Copy"}
            data-reveal
            onClick={onCopyEmail}
          >
            <span className="contact__email-swap">
              <span
                className={`contact__email-face contact__email-face--copied${
                  emailCopied ? " is-active" : ""
                }`}
              >
                Copied to clipboard ✓
              </span>
              <span
                className={`contact__email-face contact__email-face--address${
                  emailCopied ? "" : " is-active"
                }`}
              >
                akbar02work@gmail.com
              </span>
            </span>
          </a>
          <span className="sr-only" aria-live="polite">
            {emailCopied ? "Email address copied to clipboard" : ""}
          </span>
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
  );
}
