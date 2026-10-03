import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import type { ProjectStyle } from "@/constants/projectStyles";
import ProjectMediaFrame from "@/components/project/ProjectMediaFrame";
import type { ProjectPlatformId } from "@/data/projectCatalog";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/useI18n";
import { useLoopCarousel } from "@/hooks/useLoopCarousel";

interface ProjectGalleryProps {
    project: Project;
    style: ProjectStyle;
    activePlatform?: ProjectPlatformId;
}

/** "Notes list — structured summaries." → title + detail. */
const splitCaption = (caption: string) => {
    const [title = caption, ...rest] = caption.split(" — ");
    const detail = rest.join(" — ").trim();
    return { title, detail: detail.charAt(0).toLocaleUpperCase() + detail.slice(1) };
};

const ProjectScreenCarousel = ({ project, style }: ProjectGalleryProps) => {
    const { t } = useI18n();
    const screens = project.screens;
    const total = screens.length;
    const {
        scrollerRef,
        activeIndex,
        activeLoopIndex,
        loopCopies,
        middleStart,
        step,
        focusLoopIndex,
    } = useLoopCarousel(total);
    const galleryMediaType = screens[0]?.mediaType ?? project.media.type;

    const loopedScreens =
        total === 0
            ? []
            : Array.from({ length: total * loopCopies }, (_, index) => {
                  const realIndex = index % total;
                  const screen = screens[realIndex];
                  if (!screen) {
                      throw new Error(`Missing screen at index ${realIndex}`);
                  }
                  return {
                      ...screen,
                      loopKey: `${screen.id}-loop-${index}`,
                      loopIndex: index,
                      realIndex,
                  };
              });

    if (total === 0) {
        return (
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 md:pb-24">
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="inline-block h-px w-8 shrink-0 bg-volt-ink dark:bg-volt" aria-hidden="true" />
                        <h2 className="text-heading-2 text-gray-900 dark:text-white">{t.project.screens}</h2>
                    </div>
                    <p className="font-mono text-caption text-neutral-500 dark:text-neutral-400">
                        {t.project.screensSoon}
                    </p>
                </div>
            </section>
        );
    }

    const activeScreen = loopedScreens.find((screen) => screen.loopIndex === activeLoopIndex);
    const activeCaption = activeScreen?.title ? splitCaption(activeScreen.title) : null;
    return (
        <section className="pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <span className="inline-block h-px w-8 shrink-0 bg-volt-ink dark:bg-volt" aria-hidden="true" />
                        <h2 className="text-heading-2 text-gray-900 dark:text-white">{t.project.screens}</h2>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <p className="font-mono text-caption tabular-nums text-neutral-500 dark:text-neutral-400 hidden sm:block">
                            <span className="text-gray-900 dark:text-white">
                                {String(activeIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">/</span>
                            {String(total).padStart(2, "0")}
                        </p>
                        {total > 1 && <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => step(-1)}
                                aria-label={t.project.previousScreen}
                                className="inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-gray-900 transition-colors hover:border-volt-ink dark:border-neutral-800 dark:text-white dark:hover:border-volt"
                            >
                                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                            <button
                                type="button"
                                onClick={() => step(1)}
                                aria-label={t.project.nextScreen}
                                className="inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-gray-900 transition-colors hover:border-volt-ink dark:border-neutral-800 dark:text-white dark:hover:border-volt"
                            >
                                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                        </div>}
                    </div>
                </div>
                </div>
            </div>

            <div className="relative">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-background to-transparent"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-background to-transparent"
                />

                <div
                    ref={scrollerRef}
                    tabIndex={0}
                    role="region"
                    aria-label={t.project.carousel}
                    onKeyDown={(event) => {
                        if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
                        if (event.key === "ArrowLeft") {
                            event.preventDefault();
                            step(-1);
                            return;
                        }
                        if (event.key === "ArrowRight") {
                            event.preventDefault();
                            step(1);
                        }
                    }}
                    className="flex cursor-grab gap-7 md:gap-10 overflow-x-auto overscroll-x-contain py-4 outline-none data-[dragging=true]:cursor-grabbing [&[data-dragging=true]_*]:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{
                        paddingInline:
                            galleryMediaType === "browser"
                                ? "max(1.5rem, calc(50% - 24rem))"
                                : "max(1.5rem, calc(50% - 8rem))",
                    }}
                >
                    {loopedScreens.map((screen) => {
                        const isActive = screen.loopIndex === activeLoopIndex;
                        const isBuffer = total > 1 && (screen.loopIndex < middleStart || screen.loopIndex >= middleStart + total);
                        return (
                            <figure
                                key={screen.loopKey}
                                data-loop-index={screen.loopIndex}
                                data-real-index={screen.realIndex}
                                role="button"
                                tabIndex={isActive && !isBuffer ? 0 : -1}
                                aria-hidden={isBuffer}
                                aria-label={t.project.showScreen(screen.realIndex + 1)}
                                aria-pressed={isActive}
                                onClick={() => focusLoopIndex(screen.loopIndex)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        focusLoopIndex(screen.loopIndex);
                                    }
                                }}
                                className={cn(
                                    "relative flex shrink-0 cursor-pointer select-none flex-col gap-4 transition-[opacity,transform] duration-300 ease-out",
                                    screen.mediaType === "browser"
                                        ? "w-[82vw] max-w-3xl"
                                        : "w-52 sm:w-56 md:w-64",
                                    isActive
                                        ? "z-[1] opacity-100"
                                        : "opacity-75 scale-[0.94] hover:opacity-100 motion-reduce:scale-100"
                                )}
                            >
                                <div
                                    className={cn(
                                        "rounded-2xl transition-[box-shadow,ring] duration-300",
                                        isActive &&
                                            "ring-1 ring-volt-ink shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:ring-volt"
                                    )}
                                >
                                    <ProjectMediaFrame
                                        image={screen.image}
                                        alt={screen.title || project.media.alt}
                                        style={style}
                                        phoneClassName="w-full"
                                        mediaType={screen.mediaType}
                                        mockup={false}
                                        priority
                                    />
                                </div>
                                {/* Shown once, in full, below the strip. */}
                                <figcaption className="sr-only">{screen.title}</figcaption>
                            </figure>
                        );
                    })}
                </div>
            </div>

            {activeCaption ? (
                <div
                    aria-hidden="true"
                    className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-4 flex min-h-[6.5rem] justify-center"
                >
                    <p
                        key={activeCaption.title + activeCaption.detail}
                        className="max-w-lg text-center animate-in fade-in duration-500 motion-reduce:animate-none"
                    >
                        <span className="block text-body-lg font-semibold text-gray-900 dark:text-white">
                            {activeCaption.title}
                        </span>
                        {activeCaption.detail ? (
                            <span className="mt-1.5 block text-body-base text-gray-500 dark:text-slate-400">
                                {activeCaption.detail}
                            </span>
                        ) : null}
                    </p>
                </div>
            ) : null}
        </section>
    );
};

const ProjectGallery = ({
    project,
    style,
    activePlatform,
}: ProjectGalleryProps) => {
    const firstPlatform = project.platforms[0];

    if (!firstPlatform) {
        return <ProjectScreenCarousel project={project} style={style} />;
    }

    const active =
        project.platforms.find((platform) => platform.id === activePlatform) ??
        firstPlatform;
    const screens = project.screens.filter(
        (screen) => screen.platform === active.id
    );

    return (
        <ProjectScreenCarousel
            key={active.id}
            project={{ ...project, screens }}
            style={style}
        />
    );
};

export default ProjectGallery;
