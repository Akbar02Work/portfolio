import { Download, User } from "lucide-react";
import { useState } from "react";
import { withBase } from "@/lib/urls";

const HeroText = () => (
    <div className="flex-1 space-y-5 text-center md:text-left">
        <div className="hero-reveal" style={{ animationDelay: "0ms" }}>
            <h1 className="text-display-hero text-gray-900 dark:text-white">
                <span className="relative inline-block">
                    Akbar
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
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">
                    Android Engineer Founder of Lumingo
                </span>
            </h1>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "120ms" }}>
            <p className="text-body-lg font-medium text-gray-600 dark:text-slate-200 max-w-lg mx-auto md:mx-0">
                I build native Android apps and AI-powered products — from architecture and offline recovery to release.
            </p>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "200ms" }}>
            <div className="hero-cta flex justify-center md:justify-start pt-2">
                <a
                    href={withBase("/CV_Akbar_Azizov_Kotlin&Compose_EN.pdf")}
                    download="Akbar_Azizov_CV.pdf"
                    className="touch-no-ring select-none h-[3.25rem] px-7 sm:px-8 bg-transparent border border-gray-900 dark:border-slate-500 text-gray-900 dark:text-slate-200 text-[0.9375rem] font-medium rounded-full hover:border-volt-ink dark:hover:border-volt hover:text-volt-ink dark:hover:text-volt transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:outline-none"
                >
                    Download CV
                    <Download className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} />
                </a>
            </div>
        </div>
    </div>
);

const highFetchPriority = { fetchpriority: "high" };

const HeroPortrait = () => {
    const [imageError, setImageError] = useState(false);
    const avatarSrc = withBase("/avatar.png");
    const avatarSrc320 = withBase("/avatar-320.png");
    const avatarSrc480 = withBase("/avatar-480.png");
    // Prefer PNG/WebP for the face — AVIF was over-compressing skin detail.
    const avatarWebpSrcSet = `${withBase("/avatar-320.webp")} 320w, ${withBase("/avatar-480.webp")} 480w, ${withBase("/avatar.webp")} 586w`;
    const avatarSizes = "(min-width: 1024px) 400px, (min-width: 768px) 40vw, 80vw";

    return (
        <div className="hero-reveal flex-1 flex justify-center md:justify-end relative" style={{ animationDelay: "260ms" }}>
            <div className="hero-portrait relative">
                <div
                    aria-hidden="true"
                    className="absolute -inset-x-6 top-10 bottom-0 rounded-t-full bg-volt/25 dark:bg-volt/15 blur-3xl pointer-events-none"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-16 bottom-0 rounded-t-full border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm pointer-events-none"
                />
                {imageError ? (
                    <div className="relative w-full aspect-[586/934] rounded-t-full border border-white/15 bg-white/10 dark:bg-white/5 shadow-2xl flex items-center justify-center pointer-events-none select-none">
                        <User className="w-16 h-16 text-white/40" strokeWidth={1} />
                    </div>
                ) : (
                    <picture>
                        <source srcSet={avatarWebpSrcSet} sizes={avatarSizes} type="image/webp" />
                        <img
                            src={avatarSrc}
                            srcSet={`${avatarSrc320} 320w, ${avatarSrc480} 480w, ${avatarSrc} 586w`}
                            sizes={avatarSizes}
                            alt="Akbar Azizov"
                            width={586}
                            height={934}
                            {...highFetchPriority}
                            loading="eager"
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
        <section
            id="home"
            className="hero-section relative overflow-hidden hero-gradient dark:bg-background"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            <div className="hero-content max-w-[86rem] mx-auto px-5 sm:px-6 lg:px-8 relative z-10 py-20 md:py-0">
                <div className="hero-layout flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <HeroText />
                    <HeroPortrait />
                </div>
            </div>
        </section>
    );
};
