import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import reportMarkdown from "../../EASTER_PAGE_CHANGELOG.md?raw";

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
const CONFETTI_COUNT = 328;

const createConfettiPieces = (count = CONFETTI_COUNT): ConfettiPiece[] =>
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

const Easter = () => {
  const buildVersion = `v${__APP_VERSION__}+${__GIT_COMMIT_SHA__}`;
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiPieces = useMemo(() => createConfettiPieces(), []);
  const { manualVersion, reportBody } = useMemo(() => {
    const lines = reportMarkdown.replace(/\r\n/g, "\n").split("\n");
    const firstLine = lines[0]?.trim() ?? "";
    const versionMatch = firstLine.match(/^version\s*:\s*(.+)$/i);

    if (!versionMatch) {
      return {
        manualVersion: buildVersion,
        reportBody: reportMarkdown,
      };
    }

    return {
      manualVersion: versionMatch[1]?.trim() || buildVersion,
      reportBody: lines.slice(1).join("\n").replace(/^\n+/, ""),
    };
  }, [buildVersion]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setReduceMotion(mediaQuery.matches);
    applyPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", applyPreference);
      return () => mediaQuery.removeEventListener("change", applyPreference);
    }

    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    legacyMediaQuery.addListener?.(applyPreference);
    return () => legacyMediaQuery.removeListener?.(applyPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    setShowConfetti(true);
    const hideTimer = window.setTimeout(() => {
      setShowConfetti(false);
    }, 3600);
    return () => window.clearTimeout(hideTimer);
  }, [reduceMotion]);

  return (
    <MainLayout
      variant="detail"
      className="bg-[#f8f9fa] dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
    >
      <Helmet>
        <title>Easter Page | Akbar Portfolio</title>
        <meta
          name="description"
          content="Manual changelog and easter notes for the Portfolio site."
        />
      </Helmet>

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

      <main className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        <section className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur px-6 py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">Easter Page</p>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-slate-400">Site Version</p>
          <h1 className="mt-1 text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
            {manualVersion}
          </h1>
          <h2 className="mt-4 text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
            Manual Changelog
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
            Версия берется из первой строки <code>EASTER_PAGE_CHANGELOG.md</code> в формате{" "}
            <code>VERSION: ...</code>. Остальной текст файла показывается ниже.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800/60">
              <p className="text-xs text-gray-500 dark:text-slate-400">Current Runtime Version</p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{buildVersion}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800/60">
              <p className="text-xs text-gray-500 dark:text-slate-400">Route</p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">/easter</p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              state={{ scrollTo: "home" }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-slate-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 px-6 py-8">
          <pre className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/90 p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-700 dark:text-slate-300 overflow-x-auto">
            {reportBody}
          </pre>
        </section>
      </main>
    </MainLayout>
  );
};

export default Easter;
