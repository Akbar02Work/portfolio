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
        setCurrentIndex(newIndex);
    }, []);

    const handleNext = useCallback(() => {
        setSlideDirection('left');
        setCurrentIndex((prev) => (prev + 1 >= totalProjects ? 0 : prev + 1));
    }, [totalProjects]);

    const handlePrev = useCallback(() => {
        setSlideDirection('right');
        setCurrentIndex((prev) => (prev - 1 < 0 ? totalProjects - 1 : prev - 1));
    }, [totalProjects]);

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
                                className={`bg-white dark:bg-slate-800/50 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700/50 overflow-hidden shadow-lg flex flex-col md:flex-row group ${style.hoverBorder} transition-colors duration-300 ${slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}
                            >
                                {/* Gradient Placeholder with Icon */}
                                <div className={`flex-1 ${style.gradient} relative flex items-center justify-center p-8 md:p-12 min-h-[240px] md:min-h-[360px] order-1`}>
                                    <div className="relative w-36 md:w-48 aspect-[9/19] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <IconComponent className="w-14 md:w-18 h-14 md:h-18 text-white/40" strokeWidth={1} />
                                    </div>
                                </div>

                                {/* Text Content - Simplified order: Title, Description, Tags */}
                                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-start order-2">
                                    {/* 1. Title */}
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">{project.title}</h3>

                                    {/* 2. Description - Fixed height with line-clamp */}
                                    <p className="text-gray-600 dark:text-slate-300 mb-5 leading-relaxed text-sm md:text-base line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* 3. Tech tags - Unified rounded-full design */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-4 py-1.5 bg-gray-100 dark:bg-slate-700/80 text-gray-600 dark:text-slate-300 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-600"
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

                    {/* Visual swipe hint on mobile - card edge peeking */}
                    <p className="md:hidden text-center text-xs text-gray-500 dark:text-slate-400 mt-4 animate-pulse">
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
