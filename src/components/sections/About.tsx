import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { projectsSummary } from "@/data/projectsSummary";
import { Smartphone, Sparkles, WifiOff } from "lucide-react";

const pillars = [
    { Icon: Smartphone, label: "Android" },
    { Icon: Sparkles, label: "AI integration" },
    { Icon: WifiOff, label: "Offline-first" },
];

const shippedCount = projectsSummary.length;

const stats = [
    { value: "1 yr 8 mo", label: "experience" },
    {
        value: String(shippedCount),
        label: shippedCount === 1 ? "shipped project" : "shipped projects",
    },
    { value: "UTC+5", label: "Tashkent, remote" },
];

export const About = () => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.ABOUT_SECTION}>
            <section id="about" className="py-16 md:py-20 bg-background">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Section header — editorial numbering */}
                    <header className="mb-10 md:mb-14">
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-4">
                            02 / About
                        </p>
                        <h2 className="text-heading-1 text-gray-900 dark:text-white">About me</h2>
                    </header>

                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16 grid md:grid-cols-2 gap-12 md:gap-14">
                        {/* Bio */}
                        <div className="space-y-6 text-body-lg md:text-xl leading-[1.7] font-light text-gray-700 dark:text-slate-300 max-w-[65ch]">
                            <p>
                                I build production-ready Android apps powered by AI — offline-first architecture, clean code, and structured LLM outputs that turn raw models into real user features.
                            </p>
                            <p>
                                Voice-to-text, intelligent summaries, structured outputs from raw LLM responses. My stack is Kotlin, Jetpack Compose, and Clean Architecture, paired with practical LLM integration so everything works reliably even without a connection.
                            </p>

                            {/* Pillars */}
                            <ul className="flex flex-wrap gap-x-10 gap-y-6 pt-4 list-none">
                                {pillars.map(({ Icon, label }) => (
                                    <li key={label} className="flex items-center gap-3">
                                        <Icon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" strokeWidth={1.5} aria-hidden="true" />
                                        <span className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                                            {label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stats */}
                        <dl className="grid content-start gap-0 border-t border-neutral-200 dark:border-neutral-800 md:border-t-0 md:border-l md:pl-14">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="py-6 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 md:first:pt-0"
                                >
                                    <dt className="sr-only">{stat.label}</dt>
                                    <dd className="text-heading-2 font-semibold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </dd>
                                    <dd className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mt-2">
                                        {stat.label}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
