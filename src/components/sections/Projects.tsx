import { useRef, useState, useEffect, useCallback } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { projects } from "@/data/projects";
import { ChevronLeft, ChevronRight, Bot, Smartphone, Shield, Gift } from "lucide-react";

const projectStyles = [
    { gradient: "bg-gradient-to-br from-violet-500 to-fuchsia-500", icon: Bot, accent: "text-violet-600 dark:text-violet-400", hoverBorder: "hover:border-violet-500 dark:hover:border-violet-400" },
    { gradient: "bg-gradient-to-br from-blue-500 to-cyan-400", icon: Smartphone, accent: "text-blue-600 dark:text-blue-400", hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400" },
    { gradient: "bg-gradient-to-br from-amber-500 to-orange-500", icon: Shield, accent: "text-amber-600 dark:text-amber-400", hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400" },
    { gradient: "bg-gradient-to-br from-emerald-500 to-teal-400", icon: Gift, accent: "text-emerald-600 dark:text-emerald-400", hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400" },
];

const AUTO_SCROLL_INTERVAL = 4000;
const SWIPE_THRESHOLD = 50; // Minimum pixels to trigger swipe
const projectList = projects.slice(0, 4);

export const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
    const containerRef = useRef<HTMLDivElement>(null);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Touch/drag state
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const isDragging = useRef(false);

    const totalProjects = projectList.length;

    const goToIndex = useCallback((newIndex: number, direction: 'left' | 'right') => {
        setSlideDirection(direction);
        if (newIndex < 0) {
            setCurrentIndex(totalProjects - 1);
        } else if (newIndex >= totalProjects) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(newIndex);
        }
    }, [totalProjects]);

    const handleNext = useCallback(() => {
        goToIndex(currentIndex + 1, 'left');
    }, [currentIndex, goToIndex]);

    const handlePrev = useCallback(() => {
        goToIndex(currentIndex - 1, 'right');
    }, [currentIndex, goToIndex]);

    // Auto-scroll
    useEffect(() => {
        if (isHovered) {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
                autoScrollRef.current = null;
            }
            return;
        }

        autoScrollRef.current = setInterval(() => {
            handleNext();
        }, AUTO_SCROLL_INTERVAL);

        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [handleNext, isHovered]);

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        isDragging.current = true;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                handleNext(); // Swipe left = next
            } else {
                handlePrev(); // Swipe right = prev
            }
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        touchStartX.current = e.clientX;
        isDragging.current = true;
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        touchEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
        setIsHovered(false);
    };

    // Wheel scroll
    const handleWheel = useCallback((e: React.WheelEvent) => {
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
    const style = projectStyles[currentIndex % projectStyles.length];
    const IconComponent = style.icon;

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.PROJECTS_SECTION}>
            <section id="projects" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
                {/* Header - centered */}
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-12 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">Selected Works</h2>
                    <p className="text-gray-500 dark:text-slate-400 text-lg">A showcase of mobile applications and solutions.</p>
                </div>

                {/* Carousel with side arrows */}
                <div
                    ref={containerRef}
                    className="relative px-6 sm:px-8 lg:px-12"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
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
                            className="flex-1 cursor-grab active:cursor-grabbing select-none"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            <div
                                key={currentIndex}
                                className={`bg-white dark:bg-slate-800/50 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700/50 overflow-hidden shadow-lg flex flex-col md:flex-row group ${style.hoverBorder} hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 ease-out ${slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}
                            >
                                {/* Gradient Placeholder with Icon - FIRST on mobile */}
                                <div className={`flex-1 ${style.gradient} relative flex items-center justify-center p-8 md:p-12 min-h-[280px] md:min-h-[400px] order-1`}>
                                    <div className="relative w-40 md:w-56 aspect-[9/19] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                        <IconComponent className="w-16 md:w-20 h-16 md:h-20 text-white/60" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 p-6 md:p-12 flex flex-col justify-center items-start order-2">
                                    <span className={`text-xs font-bold tracking-widest ${style.accent} mb-3 uppercase`}>
                                        {project.technologies[0]}
                                    </span>
                                    <h3 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{project.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                                        {project.description.length > 200
                                            ? project.description.substring(0, 200) + '...'
                                            : project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-md text-xs font-semibold"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
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

                    {/* Mobile navigation buttons - centered below card */}
                    <div className="flex md:hidden justify-center gap-4 mt-6">
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50"
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50"
                            aria-label="Next project"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                        </button>
                    </div>

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
