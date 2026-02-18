import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { SiAndroid, SiKotlin, SiJetpackcompose, SiGooglegemini, SiOpenai } from "react-icons/si";

const floatingIcons = [
    // Android — upper-left, near "About me" title level
    { Icon: SiAndroid, animClass: "about-float-icon", color: "#3DDC84", style: { top: "14%", left: "17%" }, size: 96 },
    // Kotlin — upper-right, slightly above title
    { Icon: SiKotlin, animClass: "about-float-icon-slow", color: "#7F52FF", style: { top: "10%", right: "24%" }, size: 88 },
    // OpenAI — right edge, vertically centered
    { Icon: SiOpenai, animClass: "about-float-icon-fast", color: "currentColor", style: { top: "50%", right: "12%" }, size: 90 },
    // Gemini — bottom-left corner
    { Icon: SiGooglegemini, animClass: "about-float-icon", color: "#8E75B2", style: { bottom: "10%", left: "8%" }, size: 84 },
    // Jetpack Compose — bottom-right corner
    { Icon: SiJetpackcompose, animClass: "about-float-icon-slow", color: "#4285F4", style: { bottom: "8%", right: "6%" }, size: 92 },
];

export const About = () => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.ABOUT_SECTION}>
            <section id="about" className="py-32 bg-[#f8f9fa] dark:bg-slate-950 relative overflow-hidden scroll-mt-16">
                {floatingIcons.map(({ Icon, animClass, color, style, size }) => (
                    <div
                        key={animClass + size}
                        className={`absolute pointer-events-none select-none hidden md:block ${animClass}`}
                        style={{ ...style, color, opacity: 0.18 }}
                        aria-hidden="true"
                    >
                        <Icon size={size} />
                    </div>
                ))}

                <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                    <div className="space-y-12">
                        <h2 className="text-heading-1 text-center text-gray-900 dark:text-white">About me</h2>

                        <div className="max-w-[65ch] mx-auto text-left">
                            <div className="space-y-6 text-body-lg font-light text-gray-700 dark:text-slate-300">
                                <p>
                                    I build Android apps where AI solves real user problems. Voice-to-text, intelligent summaries, structured outputs from raw LLM responses.
                                </p>
                                <p>
                                    My stack is Kotlin, Jetpack Compose, and Clean Architecture. I combine it with practical LLM integration and offline-first design so everything works reliably, even without a connection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
