import { ArrowUpRight, Download, User } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { withBase } from "@/lib/urls";
import { scrollBehavior } from "@/lib/motion";
import { HERO_PORTRAIT_SIZES, heroPortraitSrcSet } from "@/data/heroPortrait";
import { eagerPictureRef } from "@/lib/picture";

const HERO_DESCRIPTION = "Kotlin & Compose. Offline-first apps with AI features — from architecture to release.";

const ctaBase =
    "touch-no-ring select-none h-[3.25rem] px-6 lg:px-8 rounded-full text-[0.9375rem] font-medium flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt-ink dark:focus-visible:outline-volt";

const NameStroke = () => (
    <svg
        className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible"
        viewBox="0 0 200 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <path
            d="M2 8.5C20 4 40 9 60 6C80 3 100 8 120 5.5C140 3 160 7.5 180 5C190 4 198 6 198 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            className="hero-stroke-path text-volt-ink/70 dark:text-volt/70"
            style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                opacity: 0,
            }}
        />
    </svg>
);

const scrollToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks keep the default anchor behaviour.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const contact = document.getElementById("contact");
    if (!contact) return;

    event.preventDefault();
    contact.scrollIntoView({ behavior: scrollBehavior() });
};

const HeroText = () => (
    <div className="flex-1 space-y-7 text-center md:text-left">
        <div className="hero-reveal" style={{ animationDelay: "0ms" }}>
            <h1 className="text-gray-900 dark:text-white">
                <span className="text-display-hero relative inline-block">
                    Akbar
                    <NameStroke />
                </span>
                <span className="text-display-role block mt-5 md:mt-6 text-neutral-400 dark:text-neutral-500">
                    Android Engineer,
                    <br />
                    founder of <span className="text-gray-900 dark:text-white">Lumingo</span>.
                </span>
            </h1>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "120ms" }}>
            <p className="text-body-lg text-gray-600 dark:text-slate-300 max-w-md mx-auto md:mx-0">
                {HERO_DESCRIPTION}
            </p>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "200ms" }}>
            <div className="hero-cta flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <a
                    href="#contact"
                    onClick={scrollToContact}
                    className={`${ctaBase} bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-volt-ink dark:hover:bg-volt`}
                >
                    Contact
                    <ArrowUpRight className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} aria-hidden="true" />
                </a>
                <a
                    href={withBase("/CV_Akbar_Azizov_Kotlin&Compose_EN.pdf")}
                    download="Akbar_Azizov_CV.pdf"
                    className={`${ctaBase} border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-200 hover:border-volt-ink dark:hover:border-volt hover:text-volt-ink dark:hover:text-volt`}
                >
                    Download CV
                    <Download className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} aria-hidden="true" />
                </a>
            </div>
        </div>
    </div>
);

const highFetchPriority = { fetchpriority: "high" };

const HeroPortrait = () => {
    const [imageError, setImageError] = useState(false);
    const avatarSrc = withBase("/avatar.png");
    // Prefer PNG/WebP for the face — AVIF was over-compressing skin detail.
    const avatarWebpSrcSet = heroPortraitSrcSet("webp", import.meta.env.BASE_URL);
    const avatarSizes = HERO_PORTRAIT_SIZES;

    return (
        <div className="hero-reveal flex-1 flex justify-center md:justify-end relative" style={{ animationDelay: "260ms" }}>
            <div className="hero-portrait relative">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-16 bottom-0 rounded-t-full bg-gradient-to-b from-volt/25 via-volt/10 to-transparent dark:from-white/[0.07] dark:via-white/[0.03] pointer-events-none"
                />
                {imageError ? (
                    <div className="relative w-full aspect-[586/934] rounded-t-full flex items-center justify-center pointer-events-none select-none">
                        <User className="w-16 h-16 text-neutral-400 dark:text-neutral-600" strokeWidth={1} />
                    </div>
                ) : (
                    <picture>
                        <source srcSet={avatarWebpSrcSet} sizes={avatarSizes} type="image/webp" />
                        <img
                            loading="lazy"
                            ref={eagerPictureRef}
                            sizes={avatarSizes}
                            srcSet={heroPortraitSrcSet("png", import.meta.env.BASE_URL)}
                            src={avatarSrc}
                            alt="Akbar Azizov"
                            width={586}
                            height={934}
                            {...highFetchPriority}
                            decoding="async"
                            draggable="false"
                            onError={() => setImageError(true)}
                            className="relative z-10 w-full h-auto object-contain pointer-events-none select-none"
                        />
                    </picture>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
            </div>
        </div>
    );
};

export const Hero = () => {
    return (
        <section id="home" className="hero-section relative overflow-hidden dark:bg-background">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            <div className="hero-content w-full max-w-[86rem] mx-auto px-5 sm:px-6 lg:px-8 relative z-10 py-20 md:py-0">
                <div className="hero-layout flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <HeroText />
                    <HeroPortrait />
                </div>
            </div>
        </section>
    );
};
