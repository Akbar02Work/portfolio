import { Component, lazy, Suspense, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { getBusinessUrl } from "./siteConfig";

const DesktopExperience = lazy(() => import("./components/DesktopExperience"));

const DESKTOP_MEDIA_QUERY = "(min-width: 901px)";

class CreativeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch() {
    document.body.classList.remove("is-loading");
    document.getElementById("boot-curtain")?.remove();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="desktop-gate">
        <h1>Signal lost.</h1>
        <p className="desktop-gate__copy">Creative could not load. Reload the page or return to Business.</p>
        <a className="desktop-gate__link" href={getBusinessUrl()}>Return to Business ↗</a>
      </main>
    );
  }
}

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
    <main className="desktop-gate" aria-labelledby="desktop-gate-title" lang="ru">
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

export default function App() {
  const isDesktop = useDesktopViewport();
  return isDesktop ? (
    <CreativeBoundary><Suspense fallback={null}><DesktopExperience /></Suspense></CreativeBoundary>
  ) : <DesktopOnlyGate />;
}
