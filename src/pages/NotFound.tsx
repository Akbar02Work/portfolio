import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";
import ServerLoader from "@/components/ui/ServerLoader";
import { Magnetic } from "@/components/ui/Magnetic";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <MainLayout
      variant="detail"
      className="bg-background text-gray-900 dark:text-white"
      showFooter={false}
      showBackToTop={false}
    >
      <Helmet>
        <title>Page not found | Akbar Azizov</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="flex min-h-[calc(100svh-88px)] min-h-[calc(100dvh-88px)] max-w-full items-center justify-center overflow-hidden px-4 py-[clamp(0.75rem,2.2vh,2rem)]">
        <div className="flex w-full max-w-4xl flex-col items-center gap-[clamp(0.75rem,2vh,1.75rem)]">
          {/* MONO/VOLT eyebrow */}
          <p className="font-mono text-caption uppercase tracking-[0.2em] text-volt-ink dark:text-volt">
            {"// error — page not found"}
          </p>

          {/* 404 - Large background-style text */}
          <h1 className="max-w-full select-none text-[clamp(7rem,38vw,15rem)] font-bold leading-[0.85] tracking-[-0.02em] text-gray-200 opacity-60 dark:text-slate-800">
            404
          </h1>

          {/* Animated Server Illustration */}
          <div className="my-1 scale-105 transform sm:scale-115 md:scale-125">
            <ServerLoader />
          </div>

          {/* Message */}
          <div className="mt-3 space-y-1 text-center text-gray-500 dark:text-slate-400">
            <p className="mx-auto max-w-[46rem] text-body-lg">
              I tried really hard to find{" "}
              <span className="font-mono text-gray-600 dark:text-slate-300 sm:whitespace-nowrap">
                "{location.pathname}"
              </span>{" "}
              but couldn't...
            </p>
            <p className="mx-auto max-w-[46rem] text-body-base">
              Maybe check the server above or head back home?
            </p>
          </div>

          {/* Action Button */}
          <Magnetic className="mt-3">
            <Link
              to={ROUTES.HOME}
              state={{ scrollTo: "home" }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-button text-background transition-all duration-300 hover:scale-105 hover:opacity-90 sm:px-8 sm:py-3"
            >
              Return Home
            </Link>
          </Magnetic>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotFound;
