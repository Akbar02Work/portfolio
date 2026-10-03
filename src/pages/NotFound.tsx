import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotFoundView } from "@/components/NotFoundView";
import { PageSeo } from "@/components/PageSeo";
import { useI18n } from "@/i18n/useI18n";

const NotFound = () => {
  const location = useLocation();
  const { t } = useI18n();

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
      <PageSeo title={t.seo.pageNotFound} noIndex />
      <NotFoundView
        eyebrow={t.notFound.eyebrow}
        hint={t.notFound.hint}
        actionLabel={t.notFound.returnHome}
        scrollTo="home"
      />
    </MainLayout>
  );
};

export default NotFound;
