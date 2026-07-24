import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";
import { ArrowUpRight, CircleCheck } from "lucide-react";

const EMAIL = "Akbar02work@gmail.com";

const socialLinks = [
    { href: "https://github.com/Akbar02Work", label: "GitHub" },
    { href: "https://t.me/Akbar02Work", label: "Telegram" },
    { href: "https://www.linkedin.com/in/akbar02work", label: "LinkedIn" },
];

const sanitizeSocialLink = (link: (typeof socialLinks)[number]) => {
    const href = sanitizeUrl(link.href);
    if (!href || !isAllowedExternalUrl(href)) return null;
    return { ...link, href };
};

export const Footer = ({ showSectionNumber = true }: { showSectionNumber?: boolean }) => {
    const [emailCopied, setEmailCopied] = useState(false);
    const copiedTimeoutRef = useRef<number | null>(null);

    const safeSocialLinks = socialLinks
        .map(sanitizeSocialLink)
        .filter((link): link is NonNullable<ReturnType<typeof sanitizeSocialLink>> => Boolean(link));

    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current !== null) {
                window.clearTimeout(copiedTimeoutRef.current);
            }
        };
    }, []);

    const handleEmailClick = async (event: MouseEvent<HTMLAnchorElement>) => {
        // Cmd/Ctrl+click keeps the default mailto behaviour.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        try {
            await navigator.clipboard.writeText(EMAIL);
            setEmailCopied(true);
            if (copiedTimeoutRef.current !== null) {
                window.clearTimeout(copiedTimeoutRef.current);
            }
            copiedTimeoutRef.current = window.setTimeout(() => {
                setEmailCopied(false);
                copiedTimeoutRef.current = null;
            }, 1800);
        } catch {
            window.location.href = `mailto:${EMAIL.toLowerCase()}`;
        }
    };

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.CONTACT_SECTION}>
            <footer id="contact" className="bg-background border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12 py-24">
                    {/* Section header — numbering only on home (01 Works / 02 About / 03 Contact) */}
                    <header className="mb-10 md:mb-14">
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-4">
                            {showSectionNumber ? "03 / Contact" : "Contact"}
                        </p>
                        <h2 className="text-heading-1 text-gray-900 dark:text-white">Let&apos;s work together</h2>
                    </header>

                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-6">
                            Open to remote opportunities — Tashkent, UTC+5
                        </p>

                        {/* Giant email — click copies, Cmd/Ctrl+click opens mailto */}
                        <a
                            href={`mailto:${EMAIL.toLowerCase()}`}
                            onClick={handleEmailClick}
                            title="Click to copy · ⌘/Ctrl+click to open mail"
                            className="group inline-flex flex-wrap items-baseline font-semibold text-gray-900 dark:text-white hover:text-volt-ink dark:hover:text-volt transition-colors duration-200 text-[clamp(1.75rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
                        >
                            {emailCopied ? (
                                <span className="inline-flex items-center gap-3 md:gap-4 whitespace-nowrap text-volt-ink dark:text-volt">
                                    Copied to clipboard
                                    <CircleCheck
                                        className="flex-none w-[0.72em] h-[0.72em] animate-in zoom-in-50 fade-in duration-300"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </span>
                            ) : (
                                <>
                                    <span className="whitespace-nowrap">Akbar02work</span>
                                    <span className="inline-flex items-center gap-2 md:gap-4 whitespace-nowrap">
                                        @gmail.com
                                        <ArrowUpRight
                                            className="flex-none w-[0.6em] h-[0.6em] text-volt-ink dark:text-volt transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </span>
                                </>
                            )}
                        </a>

                        {/* Social pills */}
                        <nav className="mt-14 md:mt-20 border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-wrap items-center gap-4" aria-label="Social links">
                            {safeSocialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 font-mono text-sm uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 hover:border-volt-ink dark:hover:border-volt hover:text-volt-ink dark:hover:text-volt transition-colors"
                                >
                                    {link.label}
                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} aria-hidden="true" />
                                </a>
                            ))}
                        </nav>

                    </div>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 py-6">
                    <p className="px-6 text-center font-mono text-caption uppercase tracking-[0.2em] text-neutral-500">
                        Designed &amp; built by Akbar
                    </p>
                </div>
            </footer>
        </AnimatedSection>
    );
};
