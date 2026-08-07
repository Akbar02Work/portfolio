import { useEffect } from "react";
import type { CSSProperties } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import ProjectGallery from "@/components/project/ProjectGallery";
import NextProjectTeaser from "@/components/project/NextProjectTeaser";
import { ProjectDetailsSection } from "@/components/project/ProjectDetailsSection";
import { ProjectEngineeringNote } from "@/components/project/ProjectEngineeringNote";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ROUTES } from "@/constants/routes";
import { fallbackProjectStyle, projectStylesBySlug } from "@/constants/projectStyles";
import { projects, resolveProjectPlatform } from "@/data/projects";
import type { ProjectPlatformId } from "@/data/projectCatalog";
import { toAbsoluteUrl } from "@/lib/urls";
import { ViewTransitionLink } from "@/hooks/usePageTransition";

const DEFAULT_TITLE = "Akbar — Android & AI Engineer";
const DEFAULT_DESCRIPTION =
  "Android apps built with Kotlin and Jetpack Compose, with practical AI integrations.";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIndex = projects.findIndex((project) => project.slug === slug);
  const projectData = projectIndex >= 0 ? projects[projectIndex] : undefined;
  const requestedPlatform = searchParams.get("platform");
  const activePlatform =
    projectData?.platforms.find(
      (platform) => platform.id === requestedPlatform
    )?.id ?? projectData?.platforms[0]?.id;
  const projectView = projectData
    ? resolveProjectPlatform(projectData, activePlatform)
    : undefined;
  const nextProject =
    projectIndex >= 0 && projects.length > 1
      ? projects[(projectIndex + 1) % projects.length]
      : undefined;

  const style = projectData
    ? (projectStylesBySlug[projectData.slug] ?? fallbackProjectStyle)
    : fallbackProjectStyle;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const hasPlaceholderContent = projectView
    ? /coming soon/i.test(projectView.title) || /coming soon/i.test(projectView.summary)
    : false;
  const pageTitle =
    projectView
      ? !hasPlaceholderContent
        ? `${projectView.title} | Akbar Azizov`
        : DEFAULT_TITLE
      : "Project not found | Akbar Azizov";
  const pageDescription =
    projectView && !hasPlaceholderContent ? projectView.summary : DEFAULT_DESCRIPTION;
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageImage = toAbsoluteUrl(
    projectView && !hasPlaceholderContent && projectView.image
      ? projectView.image
      : "/og-image.png"
  );
  const selectPlatform = (platform: ProjectPlatformId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("platform", platform);
    setSearchParams(nextParams);
  };

  return (
    <MainLayout
      variant="detail"
      className="bg-background text-gray-900 dark:text-white"
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="robots"
          content={projectData ? "index, follow" : "noindex, nofollow"}
        />
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

      <div
        data-project-detail
        style={{ "--project-accent": style.accentColor } as CSSProperties}
      >
        {projectData && projectView ? (
          <>
            <ProjectHeader project={projectView} />
            <ProjectGallery
              project={projectData}
              style={style}
              activePlatform={activePlatform}
              onPlatformChange={selectPlatform}
            />
            <ProjectEngineeringNote project={projectView} />
            <ProjectDetailsSection project={projectView} />
            {nextProject && <NextProjectTeaser project={nextProject} />}
          </>
        ) : (
          <section className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center space-y-4">
              <h1 className="text-heading-1">404: Project Not Found</h1>
              <ViewTransitionLink
                to={ROUTES.HOME}
                state={{ scrollTo: "projects" }}
                className="text-volt-ink dark:text-volt hover:underline"
              >
                Back to Projects
              </ViewTransitionLink>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
