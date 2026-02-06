import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import ServerLoader from "@/components/ui/ServerLoader";

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
      className="bg-white dark:bg-[#0E172A] text-gray-900 dark:text-white transition-colors duration-300"
      showFooter={false}
      showBackToTop={false}
    >
      <section className="flex min-h-[calc(100svh-88px)] min-h-[calc(100dvh-88px)] items-center justify-center px-4 py-[clamp(0.75rem,2.2vh,2rem)]">
        <div className="flex w-full max-w-4xl flex-col items-center gap-[clamp(0.75rem,2vh,1.75rem)]">
          {/* 404 - Large background-style text */}
          <h1 className="select-none text-[clamp(8.5rem,30vh,22rem)] font-bold leading-[0.85] tracking-tight text-gray-200 opacity-60 dark:text-slate-800">
            404
          </h1>

          {/* Animated Server Illustration */}
          <div className="my-1 scale-105 transform sm:scale-115 md:scale-125">
            <ServerLoader />
          </div>

          {/* Message */}
          <div className="mt-3 space-y-1 text-center text-gray-500 dark:text-slate-400">
            <p className="mx-auto max-w-[46rem] text-[clamp(1rem,0.45vw+0.9rem,1.25rem)] leading-relaxed">
              I tried really hard to find{" "}
              <span className="font-mono text-gray-600 dark:text-slate-300 sm:whitespace-nowrap">
                "{location.pathname}"
              </span>{" "}
              but couldn't...
            </p>
            <p className="mx-auto max-w-[46rem] text-[clamp(1rem,0.4vw+0.9rem,1.2rem)] leading-relaxed">
              Maybe check the server above or head back home?
            </p>
          </div>

          {/* Action Button */}
          <Link
            to="/"
            state={{ scrollTo: "home" }}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all duration-300 hover:scale-105 hover:opacity-90 sm:px-8 sm:py-3 sm:text-base"
          >
            Return Home
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotFound;
