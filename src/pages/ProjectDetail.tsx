import { useEffect } from "react";
import { PageSeo } from "@/components/PageSeo";
import { useParams, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import ProjectGallery from "@/components/project/ProjectGallery";
import {
  ProjectFeaturesSection,
  ProjectOverviewSection,
  ProjectStackSection,
} from "@/components/project/ProjectDetailsSection";
import { ProjectEngineeringNote } from "@/components/project/ProjectEngineeringNote";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { NotFoundView } from "@/components/NotFoundView";
import { fallbackProjectStyle, projectStylesBySlug } from "@/constants/projectStyles";
import { allProjectsByLocale, projectsByLocale, resolveProjectPlatform } from "@/data/projects";
import { useI18n } from "@/i18n/useI18n";
import type { ProjectPlatformId } from "@/data/projectCatalog";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { t, locale } = useI18n();
  const projects = projectsByLocale[locale];
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIndex = projects.findIndex((project) => project.slug === slug);
  const previewDraft = import.meta.env.DEV && searchParams.get("preview") === "1";
  const projectData = projectIndex >= 0
    ? projects[projectIndex]
    : previewDraft
      ? allProjectsByLocale[locale].find((project) => project.slug === slug)
      : undefined;
  const requestedPlatform = searchParams.get("platform");
  const activePlatform =
    projectData?.platforms.find(
      (platform) => platform.id === requestedPlatform
    )?.id ?? projectData?.platforms[0]?.id;
  const projectView = projectData
    ? resolveProjectPlatform(projectData, activePlatform)
    : undefined;

  const style = projectData
    ? (projectStylesBySlug[projectData.slug] ?? fallbackProjectStyle)
    : fallbackProjectStyle;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const pageTitle = projectView
    ? t.seo.projectTitle(projectView.title)
    : t.seo.projectNotFound;
  const pageDescription = projectView ? projectView.summary : t.seo.defaultDescription;
  const pageImage = projectView?.image || undefined;
  const selectPlatform = (platform: ProjectPlatformId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("platform", platform);
    setSearchParams(nextParams);
  };

  return (
    <MainLayout
      variant="detail"
      className="bg-background text-gray-900 dark:text-white"
      showFooter={Boolean(projectView)}
      showBackToTop={Boolean(projectView)}
    >
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        image={pageImage}
        noIndex={projectIndex < 0}
      />

      <div data-project-detail>
        {projectData && projectView ? (
          <>
            <ProjectHeader
              project={projectView}
              activePlatform={activePlatform}
              onPlatformChange={selectPlatform}
            />
            <ProjectGallery
              project={projectData}
              style={style}
              activePlatform={activePlatform}
            />
            <ProjectOverviewSection project={projectView} />
            <ProjectEngineeringNote project={projectView} />
            <ProjectFeaturesSection project={projectView} />
            <ProjectStackSection project={projectView} />
          </>
        ) : (
          <NotFoundView
            eyebrow={t.project.notFoundEyebrow}
            hint={t.project.notFoundHint}
            actionLabel={t.project.backToProjects}
            scrollTo="projects"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
