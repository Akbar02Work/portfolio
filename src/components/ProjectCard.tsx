import { useEffect, useState } from "react";
import type { ProjectStyle } from "@/constants/projectStyles";
import type { ProjectSummary } from "@/data/projectsSummary";
import { withBase } from "@/lib/urls";
import { sanitizeUrl } from "@/lib/urlSanitizer";

interface ProjectCardProps {
    project: ProjectSummary;
    style: ProjectStyle;
    slideDirection: "left" | "right";
}

export const ProjectCard = ({ project, style, slideDirection }: ProjectCardProps) => {
    const IconComponent = style.icon;
    const [imageError, setImageError] = useState(false);
    const normalizedSrc = project.image ? withBase(project.image) : "";
    const imageSrc = sanitizeUrl(normalizedSrc) ?? "";
    const showIcon = imageError || !project.image || /placeholder/i.test(project.image);

    useEffect(() => {
        setImageError(false);
    }, [project.image]);

    return (
        <div
            className={`bg-white dark:bg-slate-800/50 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700/50 overflow-hidden shadow-lg flex flex-col md:flex-row group min-h-[320px] md:min-h-[360px] w-full max-w-[920px] mx-auto ${style.hoverBorder} transition-colors duration-300 ${slideDirection === "left" ? "animate-slide-left" : "animate-slide-right"}`}
        >
            {/* Gradient Placeholder with Icon */}
            <div
                className={`w-full md:w-[44%] flex-none ${style.gradient} relative flex items-center justify-center p-6 md:p-8 min-h-[210px] md:min-h-[300px] order-1`}
            >
                <div className="relative w-32 md:w-40 aspect-[9/19] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    {showIcon ? (
                        <IconComponent className="w-12 md:w-14 h-12 md:h-14 text-white/40" strokeWidth={1} />
                    ) : (
                        <img
                            src={imageSrc}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            width={540}
                            height={1140}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:flex-1 min-w-0 p-5 md:p-8 flex flex-col justify-center items-center gap-5 md:gap-6 text-center order-2">
                <div className="w-full space-y-4">
                    {/* Title */}
                    <h3 className="text-heading-2 text-gray-900 dark:text-white">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="mx-auto max-w-2xl text-body-lg text-gray-600 dark:text-slate-300 line-clamp-3">
                        {project.summary}
                    </p>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap justify-center gap-2.5">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-slate-700/80 text-gray-600 dark:text-slate-300 rounded-full text-caption border border-gray-200 dark:border-slate-600"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
