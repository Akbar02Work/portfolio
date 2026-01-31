import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";

const stats = [
    { value: "4+", label: "AI Projects" },
    { value: "15+", label: "Screens Migrated" },
    { value: "200+", label: "Test Cases" },
];

export const About = () => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.ABOUT_SECTION}>
            <section id="about" className="py-24 bg-[#f8f9fa] dark:bg-slate-950 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-center md:text-left text-gray-900 dark:text-white">About me</h2>
                        <div className="space-y-8 text-gray-700 dark:text-slate-300 leading-loose text-lg md:text-xl font-light">
                            <p>
                                I don't just integrate AI into mobile apps; I engineer them to be reliable, testable, and production-ready. My approach combines solid Android fundamentals (MVVM, Clean Arch) with practical AI implementation—structured outputs, multi-provider strategies, and offline-first storage. Currently completing my Master's in CS while building the next generation of intelligent mobile products.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200 dark:border-slate-800">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center md:text-left">
                                    <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
                                    <div className="text-xs md:text-sm text-gray-500 dark:text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
