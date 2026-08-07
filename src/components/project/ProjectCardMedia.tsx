import ProjectMediaFrame from "@/components/project/ProjectMediaFrame";
import { ProjectPlatformTabs } from "@/components/project/ProjectPlatformTabs";
import type { ProjectStyle } from "@/constants/projectStyles";
import type { ProjectPlatformId } from "@/data/projectCatalog";
import type { ProjectSummary } from "@/data/projectsSummary";
import { ViewTransitionLink } from "@/hooks/usePageTransition";

type ProjectCardMediaProps = {
  project: ProjectSummary;
  style: ProjectStyle;
  href: string;
  activePlatform: ProjectPlatformId;
  onPlatformChange: (platform: ProjectPlatformId) => void;
};

const mediaLinkClass =
  "relative block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt-ink dark:focus-visible:outline-volt";

const ProjectCardMedia = ({
  project,
  style,
  href,
  activePlatform,
  onPlatformChange,
}: ProjectCardMediaProps) => {
  const firstPlatform = project.platformPreviews[0];

  if (!firstPlatform) {
    return (
      <ViewTransitionLink
        to={href}
        className={mediaLinkClass}
        aria-label={`Open ${project.title} case study`}
      >
        <ProjectMediaFrame
          image={project.image}
          alt={project.media.alt}
          style={style}
        />
      </ViewTransitionLink>
    );
  }

  const activePreview =
    project.platformPreviews.find((preview) => preview.id === activePlatform) ??
    firstPlatform;

  return (
    <div className="flex min-h-[30rem] flex-col justify-center gap-6">
      <ProjectPlatformTabs
        platforms={project.platforms}
        activePlatform={activePreview.id}
        onSelect={onPlatformChange}
        label={`Choose ${project.title} platform`}
        className="justify-center md:justify-start"
      />

      <ViewTransitionLink
        to={href}
        className={`${mediaLinkClass} flex min-h-[24rem] items-center justify-center md:min-h-[30rem]`}
        aria-label={`Open ${project.title} ${activePreview.label} case study`}
      >
        <ProjectMediaFrame
          image={activePreview.image}
          alt={activePreview.alt}
          style={style}
          mediaType={activePreview.mediaType}
          phoneClassName={
            activePreview.mediaType === "browser"
              ? "w-full max-w-xl"
              : "w-44 md:w-64"
          }
        />
      </ViewTransitionLink>
    </div>
  );
};

export default ProjectCardMedia;
