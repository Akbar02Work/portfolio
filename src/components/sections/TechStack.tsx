import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";

const techStack = [
    "Kotlin",
    "Jetpack Compose",
    "OpenAI API",
    "Gemini",
    "Room",
    "Clean Architecture",
    "Hilt",
    "Coroutines",
];

export const TechStack = () => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.TECH_STACK}>
            <div className="tech-stack-bar w-full border-y border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm py-6 overflow-hidden">
                <ul className="flex flex-wrap justify-center items-center list-none m-0 p-0 max-w-6xl mx-auto px-4">
                    {techStack.map((tech, index) => (
                        <li
                            key={tech}
                            className="flex items-center text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-[0.05em]"
                        >
                            <span className="px-2 md:px-4">{tech}</span>
                            {index < techStack.length - 1 && (
                                <span className="text-gray-300 dark:text-slate-600">•</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </AnimatedSection>
    );
};
