import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { PageLoader } from "@/components/ui/PageLoader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransitionProvider } from "@/hooks/usePageTransition";
import { ROUTES } from "@/constants/routes";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";
import { ThemeProvider } from "./hooks/useTheme";
import { I18nProvider } from "./i18n/I18nProvider";
import { localizePath } from "./i18n/locales";

const NotFound = lazy(() => import("./pages/NotFound"));
const Easter = lazy(() => import("./pages/Easter"));

const App = () => {
  useDynamicFavicon();

  return (
    <ThemeProvider>
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter
            basename={import.meta.env.BASE_URL}
          >
            <I18nProvider>
            <PageTransitionProvider>
              <Routes>
                <Route path={ROUTES.HOME} element={<Index />} />
                <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetail />} />
                <Route path={localizePath(ROUTES.HOME, "ru")} element={<Index />} />
                <Route path={localizePath(ROUTES.PROJECT_DETAIL, "ru")} element={<ProjectDetail />} />
                <Route
                  path={ROUTES.EASTER}
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Easter />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Routes>
            </PageTransitionProvider>
            </I18nProvider>
          </BrowserRouter>
          <SpeedInsights />
        </ErrorBoundary>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
