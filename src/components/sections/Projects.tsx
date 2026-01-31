import { useRef } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { projects } from "@/data/projects";
import { ChevronLeft, ChevronRight, Bot, Smartphone, Shield, Gift } from "lucide-react";

const projectStyles = [
    { gradient: "bg-gradient-to-br from-violet-500 to-fuchsia-500", icon: Bot, accent: "text-violet-600 dark:text-violet-400", hoverBorder: "hover:border-violet-500" },
    { gradient: "bg-gradient-to-br from-blue-500 to-cyan-400", icon: Smartphone, accent: "text-blue-600 dark:text-blue-400", hoverBorder: "hover:border-blue-500" },
    { gradient: "bg-gradient-to-br from-amber-500 to-orange-500", icon: Shield, accent: "text-amber-600 dark:text-amber-400", hoverBorder: "hover:border-amber-500" },
    { gradient: "bg-gradient-to-br from-emerald-500 to-teal-400", icon: Gift, accent: "text-emerald-600 dark:text-emerald-400", hoverBorder: "hover:border-emerald-500" },
];

export const Projects = () => {
    const projectsRef = useRef<HTMLDivElement>(null);

    const scrollProjects = (direction: 'left' | 'right') => {
        if (projectsRef.current) {
            const cardWidth = 880;
            const currentScroll = projectsRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - cardWidth
                : currentScroll + cardWidth;

            projectsRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.PROJECTS_SECTION}>
            <section id="projects" className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">Selected Works</h2>
                        <p className="text-gray-500 dark:text-slate-400 text-lg">A showcase of mobile applications and solutions.</p>
                    </div>
                    <div className="hidden md:flex gap-4 items-center">
                        <button
                            onClick={() => scrollProjects('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => scrollProjects('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Next project"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scrolling Cards */}
                <div
                    ref={projectsRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 px-4 sm:px-6 lg:px-8 md:pb-16 scrollbar-hide"
                >
                    {projects.slice(0, 4).map((project, index) => {
                        const style = projectStyles[index % projectStyles.length];
                        const IconComponent = style.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={project.id}
                                className={`flex-none w-[90vw] md:w-[850px] snap-center bg-white dark:bg-slate-800/50 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700/50 overflow-hidden shadow-lg flex flex-col md:flex-row group ${style.hoverBorder} hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-out`}
                            >
                                {/* Text Content */}
                                <div className={`flex-1 p-8 md:p-12 flex flex-col justify-center items-start ${isEven ? 'order-2 md:order-1' : 'order-2'}`}>
                                    <span className={`text-xs font-bold tracking-widest ${style.accent} mb-3 uppercase`}>
                                        {project.technologies[0]}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{project.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-300 mb-8 leading-relaxed">
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

                                {/* Gradient Placeholder with Icon */}
                                <div className={`flex-1 ${style.gradient} relative flex items-center justify-center p-12 ${isEven ? 'order-1 md:order-2' : 'order-1'}`}>
                                    <div className="relative w-48 md:w-56 aspect-[9/19] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                        <IconComponent className="w-20 h-20 text-white/60" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </AnimatedSection>
    );
};
