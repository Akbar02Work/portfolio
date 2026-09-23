import { useEffect } from "react";
import { PageSeo } from "@/components/PageSeo";
import { useParams, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import ProjectGallery from "@/components/project/ProjectGallery";
import NextProjectTeaser from "@/components/project/NextProjectTeaser";
import { ProjectDetailsSection } from "@/components/project/ProjectDetailsSection";
import { ProjectEngineeringNote } from "@/components/project/ProjectEngineeringNote";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ROUTES } from "@/constants/routes";
import { fallbackProjectStyle, projectStylesBySlug } from "@/constants/projectStyles";
import { projectsByLocale, resolveProjectPlatform } from "@/data/projects";
import { useI18n } from "@/i18n/useI18n";
import type { ProjectPlatformId } from "@/data/projectCatalog";
import { ViewTransitionLink } from "@/hooks/usePageTransition";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { t, locale, localize } = useI18n();
  const projects = projectsByLocale[locale];
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
        ? t.seo.projectTitle(projectView.title)
        : t.seo.defaultTitle
      : t.seo.projectNotFound;
  const pageDescription =
    projectView && !hasPlaceholderContent ? projectView.summary : t.seo.defaultDescription;
  const pageImage =
    projectView && !hasPlaceholderContent && projectView.image
      ? projectView.image
      : undefined;
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
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        image={pageImage}
        noIndex={!projectData}
      />

      <div data-project-detail>
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
              <h1 className="text-heading-1">{t.project.notFoundHeading}</h1>
              <ViewTransitionLink
                to={localize(ROUTES.HOME)}
                state={{ scrollTo: "projects" }}
                className="text-volt-ink dark:text-volt hover:underline"
              >
                {t.project.backToProjects}
              </ViewTransitionLink>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
