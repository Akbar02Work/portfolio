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
import { ThemeProvider } from "./hooks/useTheme";

const NotFound = lazy(() => import("./pages/NotFound"));
const Easter = lazy(() => import("./pages/Easter"));

const App = () => {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter
            basename={import.meta.env.BASE_URL}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <PageTransitionProvider>
              <Routes>
                <Route path={ROUTES.HOME} element={<Index />} />
                <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetail />} />
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
          </BrowserRouter>
          <SpeedInsights />
        </ErrorBoundary>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
