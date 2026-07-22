import { Download, User } from "lucide-react";
import { useState } from "react";
import { withBase } from "@/lib/urls";

const HeroText = () => (
    <div className="flex-1 space-y-5 text-center md:text-left">
        {/* Availability status — first thing a recruiter sees */}
        <div className="hero-reveal flex justify-center md:justify-start" style={{ animationDelay: "0ms" }}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-2 font-mono text-caption whitespace-nowrap text-gray-600 dark:text-slate-300">
                <span className="relative flex h-2 w-2">
                    <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-volt-ink dark:bg-volt" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-volt-ink dark:bg-volt" />
                </span>
                Available for remote work<span className="hidden sm:inline">&nbsp;— Tashkent, UTC+5</span>
            </span>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "90ms" }}>
            <p className="font-mono text-caption uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">
                Akbar Azizov — Android &amp; AI Engineer
            </p>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "180ms" }}>
            <h1 className="text-display-hero text-gray-900 dark:text-white">
                Android
                <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">
                    Developer
                    {/* Hand-drawn stroke SVG */}
                    <svg
                        className="absolute -bottom-2 left-0 w-full h-3"
                        viewBox="0 0 200 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M2 8.5C20 4 40 9 60 6C80 3 100 8 120 5.5C140 3 160 7.5 180 5C190 4 198 6 198 6"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            pathLength={1}
                            className="hero-stroke-path text-volt-ink/70 dark:text-volt/70"
                        />
                    </svg>
                </span>
            </h1>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "270ms" }}>
            <p className="text-body-lg font-medium text-gray-600 dark:text-slate-200 max-w-lg mx-auto md:mx-0">
                Turning AI models into real Android features
            </p>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "350ms" }}>
            <p className="text-body-base text-gray-500 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
                I build production-ready Android apps powered by AI. Offline-first architecture, clean code, and structured LLM outputs that turn raw models into real user features
            </p>
        </div>
        <div className="hero-reveal" style={{ animationDelay: "430ms" }}>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={() => {
                        const element = document.getElementById("projects");
                        element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black text-button rounded-full hover:opacity-90 transition-opacity text-center flex items-center justify-center"
                >
                    Selected Works
                </button>
                <a
                    href={withBase("/CV_Akbar_Azizov_Kotlin&Compose_EN.pdf")}
                    download="Akbar_Azizov_CV.pdf"
                    className="h-12 px-6 bg-transparent border border-gray-900 dark:border-slate-500 text-gray-900 dark:text-slate-200 text-button rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                    Download CV
                    <Download className="w-4 h-4" strokeWidth={2} />
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

    return (
        <div className="hero-reveal flex-1 flex justify-center md:justify-end relative" style={{ animationDelay: "260ms" }}>
            <div className="hero-portrait relative">
                {/* MONO/VOLT signature: volt glow behind the arch */}
                <div
                    aria-hidden="true"
                    className="absolute -inset-x-6 top-10 bottom-0 rounded-t-full bg-volt/25 dark:bg-volt/15 blur-3xl pointer-events-none"
                />
                {/* Arch backdrop — figure breaks the frame */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-16 bottom-0 rounded-t-full border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm pointer-events-none"
                />
                {imageError ? (
                    <div className="relative w-full aspect-[586/934] rounded-t-full border border-white/15 bg-white/10 dark:bg-white/5 shadow-2xl flex items-center justify-center pointer-events-none select-none">
                        <User className="w-16 h-16 text-white/40" strokeWidth={1} />
                    </div>
                ) : (
                    <img
                        src={avatarSrc}
                        srcSet={`${avatarSrc320} 320w, ${avatarSrc480} 480w, ${avatarSrc} 586w`}
                        sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 80vw"
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
            <div className="hero-content max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 py-20 md:py-0">
                <div className="hero-layout flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <HeroText />
                    <HeroPortrait />
                </div>
            </div>
        </section>
    );
};
