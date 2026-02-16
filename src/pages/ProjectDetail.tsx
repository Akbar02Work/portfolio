import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectCarouselSection } from "@/components/project/ProjectCarouselSection";
import { ProjectDetailsSection } from "@/components/project/ProjectDetailsSection";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ROUTES } from "@/constants/routes";
import { fallbackProjectStyle, projectStylesBySlug } from "@/constants/projectStyles";
import { CAROUSEL_AUTO_SCROLL_INTERVAL_MS } from "@/constants/ui.constants";
import { projects } from "@/data/projects";
import { useCarouselController } from "@/hooks/useCarouselController";
import { toAbsoluteUrl } from "@/lib/urls";

const DEFAULT_TITLE = "Akbar — Android & AI Engineer";
const DEFAULT_DESCRIPTION =
  "Building intelligent mobile apps with Kotlin & Gemini. Offline-first architecture, 99.9% crash-free stability.";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug?: string }>();
  const projectData = projects.find((project) => project.slug === slug);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(null);

  const screens = projectData?.screens ?? [];
  const style = projectData
    ? (projectStylesBySlug[projectData.slug] ?? fallbackProjectStyle)
    : fallbackProjectStyle;

  const { currentIndex, slideDirection, handleNext, handlePrev, goToIndex } =
    useCarouselController({
      totalItems: screens.length,
      autoScrollMs: CAROUSEL_AUTO_SCROLL_INTERVAL_MS,
      onSlugChange: slug,
    });

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenFeatureIndex(null);
  }, [slug]);

  const hasPlaceholderContent = projectData
    ? /coming soon/i.test(projectData.title) || /coming soon/i.test(projectData.description)
    : false;
  const pageTitle =
    projectData && !hasPlaceholderContent
      ? `${projectData.title} | Akbar Azizov`
      : DEFAULT_TITLE;
  const pageDescription =
    projectData && !hasPlaceholderContent ? projectData.description : DEFAULT_DESCRIPTION;
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageImage = toAbsoluteUrl(
    projectData && !hasPlaceholderContent && projectData.image
      ? projectData.image
      : "/og-image.png"
  );

  return (
    <MainLayout
      variant="detail"
      className="bg-white dark:bg-[#0E172A] text-gray-900 dark:text-white transition-colors duration-300"
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      <main className="flex-grow">
        {projectData ? (
          <>
            <ProjectHeader project={projectData} />
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 my-3 sm:my-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
            </div>
            <ProjectCarouselSection
              screens={screens}
              currentIndex={currentIndex}
              slideDirection={slideDirection}
              style={style}
              onNext={handleNext}
              onPrev={handlePrev}
              onSelectIndex={goToIndex}
            />
            <ProjectDetailsSection
              project={projectData}
              openFeatureIndex={openFeatureIndex}
              setOpenFeatureIndex={setOpenFeatureIndex}
            />
          </>
        ) : (
          <section className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center space-y-4">
              <h1 className="text-heading-1">404: Project Not Found</h1>
              <Link
                to={ROUTES.HOME}
                state={{ scrollTo: "projects" }}
                className="text-blue-500 hover:underline"
              >
                Back to Projects
              </Link>
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  );
};

export default ProjectDetail;
