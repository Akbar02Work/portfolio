import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PageSeo } from "@/components/PageSeo";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";
import { getCreativeUrl } from "@/constants/siteVersions";
import { ViewTransitionLink } from "@/hooks/usePageTransition";
import { useI18n } from "@/i18n/useI18n";

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  width: number;
  height: number;
  color: string;
};

const CONFETTI_COLORS = [
  "#111827",
  "#1D4ED8",
  "#0EA5E9",
  "#16A34A",
  "#CA8A04",
  "#DC2626",
  "#7C3AED",
];
const DESKTOP_CONFETTI_COUNT = 150;
const MOBILE_CONFETTI_COUNT = 80;
const MOBILE_BREAKPOINT_PX = 768;
const CONFETTI_HIDE_DELAY_MS = 3600;

const createConfettiPieces = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 500,
    duration: 1700 + Math.random() * 900,
    drift: -180 + Math.random() * 360,
    rotate: Math.random() * 360,
    width: 5 + Math.random() * 7,
    height: 10 + Math.random() * 10,
    color:
      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ??
      "#111827",
  }));

const getConfettiStyle = (piece: ConfettiPiece): CSSProperties =>
  ({
    left: `${piece.left}%`,
    width: `${piece.width}px`,
    height: `${piece.height}px`,
    animationDelay: `${piece.delay}ms`,
    animationDuration: `${piece.duration}ms`,
    backgroundColor: piece.color,
    transform: `translate3d(0, -14vh, 0) rotate(${piece.rotate}deg)`,
    ["--confetti-drift" as string]: `${piece.drift}px`,
    ["--confetti-start-rotate" as string]: `${piece.rotate}deg`,
    ["--confetti-end-rotate" as string]: `${piece.rotate + 620}deg`,
  }) as CSSProperties;

const getConfettiCount = (reduceMotion: boolean): number => {
  if (reduceMotion) return 0;
  if (typeof window === "undefined") return DESKTOP_CONFETTI_COUNT;
  return window.innerWidth < MOBILE_BREAKPOINT_PX
    ? MOBILE_CONFETTI_COUNT
    : DESKTOP_CONFETTI_COUNT;
};

const Easter = () => {
  const { t, localize } = useI18n();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [confettiCount, setConfettiCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiPieces = useMemo(() => createConfettiPieces(confettiCount), [confettiCount]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setReduceMotion(mediaQuery.matches);
    applyPreference();

    mediaQuery.addEventListener("change", applyPreference);
    return () => mediaQuery.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    const updateConfettiCount = () => {
      setConfettiCount(getConfettiCount(reduceMotion));
    };

    updateConfettiCount();
    window.addEventListener("resize", updateConfettiCount);
    return () => window.removeEventListener("resize", updateConfettiCount);
  }, [reduceMotion]);

  useEffect(() => {
    if (confettiCount === 0) {
      setShowConfetti(false);
      return;
    }

    setShowConfetti(true);
    const hideTimer = window.setTimeout(() => {
      setShowConfetti(false);
    }, CONFETTI_HIDE_DELAY_MS);
    return () => window.clearTimeout(hideTimer);
  }, [confettiCount]);

  return (
    <MainLayout
      variant="detail"
      className="bg-background text-gray-900 dark:text-white"
      showFooter={false}
      showBackToTop={false}
    >
      <PageSeo title={t.easter.seoTitle} description={t.easter.text} noIndex />

      {showConfetti && (
        <div className="easter-confetti-layer" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="easter-confetti-piece"
              style={getConfettiStyle(piece)}
            />
          ))}
        </div>
      )}

      <section className="flex min-h-[calc(100svh-88px)] items-center px-6 sm:px-8 lg:px-12 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <p className="font-mono text-caption uppercase tracking-[0.2em] text-volt-ink dark:text-volt">
            {t.easter.eyebrow}
          </p>
          <h1 className="mt-6 font-black text-[clamp(3rem,9vw,7rem)] leading-[0.95] tracking-[-0.045em] text-gray-900 dark:text-white">
            Creative mode
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-gray-600 dark:text-slate-300">
            {t.easter.text}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={getCreativeUrl()}
              className="touch-no-ring h-[3.25rem] px-7 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[0.9375rem] font-medium inline-flex items-center gap-2 transition-colors hover:bg-volt-ink dark:hover:bg-volt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
            >
              {t.easter.enter}
              <ArrowUpRight className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} aria-hidden="true" />
            </a>
            <ViewTransitionLink
              to={localize(ROUTES.HOME)}
              state={{ scrollTo: "home" }}
              className="touch-no-ring h-[3.25rem] px-7 rounded-full border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-200 text-[0.9375rem] font-medium inline-flex items-center gap-2 transition-colors hover:border-volt-ink dark:hover:border-volt hover:text-volt-ink dark:hover:text-volt"
            >
              <ArrowLeft className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} aria-hidden="true" />
              {t.easter.back}
            </ViewTransitionLink>
          </div>

          <p className="mt-8 font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 min-[901px]:hidden">
            {t.easter.desktopOnly}
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Easter;
