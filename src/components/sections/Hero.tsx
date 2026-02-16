import { Download, User } from "lucide-react";
import { useState } from "react";
import { withBase } from "@/lib/urls";

const HeroText = () => (
    <div className="flex-1 space-y-5 text-center md:text-left">
        <h1 className="text-display-hero text-gray-900 dark:text-white">
            I{"\u2019"}m{" "}
            <span className="relative inline-block">
                Akbar
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
                        className="text-gray-400/70 dark:text-slate-500/70"
                    />
                </svg>
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">
                Android Developer
            </span>
        </h1>
        <p className="text-body-lg font-medium text-gray-600 dark:text-slate-200 max-w-lg mx-auto md:mx-0 mb-2">
            Android Engineer focused on AI.
        </p>
        <p className="text-body-base text-gray-500 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
            Engineering reliable, privacy-aware AI integrations for mobile. Bridging the gap between LLMs and Android production code.
        </p>
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
);

const HeroPortrait = () => {
    const [imageError, setImageError] = useState(false);
    const avatarSrc = withBase("/avatar.png");
    const avatarSrc320 = withBase("/avatar-320.png");
    const avatarSrc480 = withBase("/avatar-480.png");

    return (
        <div className="flex-1 flex justify-center md:justify-end relative">
            <div className="hero-portrait relative">
                {imageError ? (
                    <div className="w-full aspect-[586/934] rounded-[2rem] border border-white/15 bg-white/10 dark:bg-white/5 shadow-2xl flex items-center justify-center pointer-events-none select-none">
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
                        fetchpriority="high"
                        loading="eager"
                        decoding="async"
                        draggable="false"
                        onError={() => setImageError(true)}
                        className="w-full h-auto object-contain pointer-events-none select-none"
                    />
                )}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8f9fa] dark:from-slate-950 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

export const Hero = () => {
    return (
        <section
            id="home"
            className="hero-section relative overflow-hidden hero-gradient dark:bg-slate-950"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8f9fa] dark:to-slate-950 pointer-events-none" />
            <div className="hero-content max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 py-20 md:py-0">
                <div className="hero-layout flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <HeroText />
                    <HeroPortrait />
                </div>
            </div>
        </section>
    );
};
