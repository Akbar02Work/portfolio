import { useCallback, type KeyboardEvent, type WheelEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/ProjectCard";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { CAROUSEL_AUTO_SCROLL_INTERVAL_MS } from "@/constants/ui.constants";
import { buildProjectUrl } from "@/constants/routes";
import { projectsSummary } from "@/data/projectsSummary";
import { projectStylesList } from "@/constants/projectStyles";
import { useCarouselController } from "@/hooks/useCarouselController";
import { useSwipe } from "@/hooks/useSwipe";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projectList = projectsSummary;

export const Projects = () => {
    const totalProjects = projectList.length;
    const {
        currentIndex,
        slideDirection,
        handleNext,
        handlePrev,
        goToIndex,
    } = useCarouselController({
        totalItems: totalProjects,
        autoScrollMs: CAROUSEL_AUTO_SCROLL_INTERVAL_MS,
    });

    // Navigate to project detail
    const navigate = useNavigate();

    const handleCardTap = useCallback(() => {
        const targetProject = projectList[currentIndex];
        if (targetProject) {
            navigate(buildProjectUrl(targetProject.slug));
        }
    }, [currentIndex, navigate]);

    const swipeHandlers = useSwipe({
        onSwipeLeft: handleNext,
        onSwipeRight: handlePrev,
        onTap: handleCardTap,
    });

    const handleCardKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const targetProject = projectList[currentIndex];
            if (targetProject) {
                navigate(buildProjectUrl(targetProject.slug));
            }
        }
    }, [currentIndex, navigate]);

    // Wheel scroll
    const handleWheel = useCallback((e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            if (e.deltaX > 30) {
                handleNext();
            } else if (e.deltaX < -30) {
                handlePrev();
            }
        }
    }, [handleNext, handlePrev]);

    const project = projectList[currentIndex];
    if (!project) {
        return null;
    }
    const style = projectStylesList[currentIndex % projectStylesList.length] ?? projectStylesList[0]!;

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.PROJECTS_SECTION}>
            <section id="projects" className="py-32 bg-white dark:bg-slate-900 overflow-hidden">
                {/* Header - centered */}
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-12 text-center">
                    <h2 className="text-heading-1 mb-4 text-gray-900 dark:text-white">Selected Works</h2>
                    <p className="text-body-lg text-gray-500 dark:text-slate-400">A showcase of mobile applications and solutions.</p>
                </div>

                {/* Carousel with side arrows */}
                <div
                    className="relative px-6 sm:px-8 lg:px-12"
                    onWheel={handleWheel}
                >
                    {/* Container with arrows on sides */}
                    <div className="max-w-6xl mx-auto flex items-center gap-4 md:gap-8">
                        {/* Left arrow - hidden on very small screens, shown on sides */}
                        <button
                            onClick={handlePrev}
                            className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50"
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                        </button>

                        {/* Project Card */}
                        <div
                            className="flex-1 cursor-pointer active:cursor-grabbing select-none"
                            {...swipeHandlers}
                            onKeyDown={handleCardKeyDown}
                            role="link"
                            tabIndex={0}
                            aria-label={`Open project ${project.title}`}
                        >
                            <ProjectCard
                                key={project.id}
                                project={project}
                                style={style}
                                slideDirection={slideDirection}
                            />
                        </div>

                        {/* Right arrow - hidden on very small screens */}
                        <button
                            onClick={handleNext}
                            className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50"
                            aria-label="Next project"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                        </button>
                    </div>

                    <div aria-live="polite" aria-atomic="true" className="sr-only">
                        Project {currentIndex + 1} of {totalProjects}: {project.title}
                    </div>

                    {/* Visual swipe hint on mobile - card edge peeking */}
                    <p className="md:hidden text-center text-caption text-gray-500 dark:text-slate-400 mt-4 animate-pulse motion-reduce:animate-none">
                        ← Swipe to explore →
                    </p>

                    {/* Progress indicators - under the card */}
                    <div className="flex justify-center gap-2 mt-6 md:mt-8">
                        {projectList.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const direction = idx > currentIndex ? 'left' : 'right';
                                    goToIndex(idx, direction);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? "w-8 bg-gray-900 dark:bg-white"
                                    : "w-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500"
                                    }`}
                                aria-label={`Go to project ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
