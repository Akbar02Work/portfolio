import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";

const stats = [
    { value: "4+", label: "AI Projects" },
    { value: "99.9%", label: "Crash-free" },
    { value: "✓", label: "Offline-First Core" },
];

export const About = () => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.ABOUT_SECTION}>
            <section id="about" className="py-32 bg-[#f8f9fa] dark:bg-slate-950 relative">
                <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {/* Title stays centered */}
                        <h2 className="text-heading-1 text-center text-gray-900 dark:text-white">About me</h2>

                        {/* Paragraph text - left aligned with max-width for readability */}
                        <div className="max-w-[65ch] mx-auto text-left">
                            <div className="space-y-8 text-body-lg font-light text-gray-700 dark:text-slate-300">
                                <p>
                                    I engineer AI features for mobile, not just demos. Solid Android fundamentals (MVVM/Clean Arch) combined with practical LLM integration: structured outputs, multi-provider strategies, and offline-first storage.
                                </p>
                            </div>
                        </div>

                        {/* Stats - Unified styling */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-12 border-t border-transparent dark:border-transparent relative before:content-[''] before:absolute before:-top-6 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-slate-700">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center justify-center">
                                    <div className="text-heading-2 text-gray-900 dark:text-white font-sans mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-caption text-gray-500 dark:text-slate-400 uppercase tracking-[0.08em]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
