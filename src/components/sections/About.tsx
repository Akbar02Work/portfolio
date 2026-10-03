import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { aboutContent, type ExperienceEntry } from "@/data/about";
import { useI18n } from "@/i18n/useI18n";

const monoLabel = "font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400";

const TimelineRow = ({ entry, ndaTitle }: { entry: ExperienceEntry; ndaTitle: string }) => (
    <li className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr] gap-x-6 gap-y-1.5 py-5 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
        <span className={`${monoLabel} sm:pt-1.5 tabular-nums`}>{entry.period}</span>
        <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                <span>
                    {entry.role}
                    <span className="font-normal text-neutral-400 dark:text-neutral-500"> · </span>
                    {entry.place}
                </span>
                {entry.badge && (
                    <span className={monoLabel} title={ndaTitle}>
                        {entry.badge}
                    </span>
                )}
            </p>
            {entry.note && (
                <p className="mt-1.5 text-body-sm md:text-base text-gray-600 dark:text-slate-400 max-w-[52ch]">
                    {entry.note}
                </p>
            )}
        </div>
    </li>
);

export const About = () => {
    const { t, locale } = useI18n();
    const { bio: aboutBio, principles: aboutPrinciples, experience, education, meta: aboutMeta } = aboutContent[locale];
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.ABOUT_SECTION}>
            <section id="about" className="pt-10 pb-16 md:pt-12 md:pb-20 bg-background border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Section header — editorial numbering */}
                    <header className="mb-10 md:mb-14">
                        <p className={`${monoLabel} mb-4`}>{t.about.eyebrow}</p>
                        <h2 className="text-heading-1 text-gray-900 dark:text-white">{t.about.title}</h2>
                    </header>

                    <div className="grid md:grid-cols-2 gap-12 md:gap-14">
                        {/* Bio + principles */}
                        <div className="space-y-10 max-w-[65ch]">
                            <div className="space-y-6">
                                <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-300">
                                    {aboutMeta.map((item, index) => (
                                        <span key={item} className={`inline-flex items-center gap-3 ${index === 0 ? "basis-full text-volt-ink dark:text-volt" : ""}`}>
                                            {index > 1 && <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600">/</span>}
                                            {item}
                                        </span>
                                    ))}
                                </p>
                                <div className="space-y-6 text-body-lg md:text-xl leading-[1.7] font-light text-gray-700 dark:text-slate-300">
                                    {aboutBio.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            <ol className="list-none border-t border-neutral-200 dark:border-neutral-800">
                                {aboutPrinciples.map((principle, index) => (
                                    <li
                                        key={principle.title}
                                        className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-4 border-b border-neutral-200 dark:border-neutral-800"
                                    >
                                        <span className="font-mono text-caption tracking-[0.14em] text-volt-ink dark:text-volt pt-1">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <p className="text-base text-gray-600 dark:text-slate-400">
                                            <span className="font-semibold text-gray-900 dark:text-white">{principle.title}.</span>{" "}
                                            {principle.text}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Experience + education */}
                        <div className="md:border-l md:border-neutral-200 md:dark:border-neutral-800 md:pl-14 space-y-12">
                            <div>
                                <h3 className={`${monoLabel} mb-1`}>{t.about.experience}</h3>
                                <ol className="list-none">
                                    {experience.map((entry) => (
                                        <TimelineRow key={`${entry.place}-${entry.role}`} entry={entry} ndaTitle={t.about.ndaTitle} />
                                    ))}
                                </ol>
                            </div>
                            <div>
                                <h3 className={`${monoLabel} mb-1`}>{t.about.education}</h3>
                                <ol className="list-none">
                                    {education.map((entry) => (
                                        <TimelineRow key={`${entry.place}-${entry.role}`} entry={entry} ndaTitle={t.about.ndaTitle} />
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};
