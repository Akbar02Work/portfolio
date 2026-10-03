import { type MouseEvent } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CopySwap } from "@/components/ui/CopySwap";
import { useCopyFeedback } from "@/hooks/useCopyFeedback";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";
import { ArrowUpRight, CircleCheck, Copy } from "lucide-react";
import { CONTACT_EMAIL, contactLinks, footerLinkOrder } from "@/data/contacts";
import { useI18n } from "@/i18n/useI18n";

const EMAIL = CONTACT_EMAIL;

const socialLinks = footerLinkOrder.flatMap((id) => {
    const link = contactLinks.find((candidate) => candidate.id === id);
    return link ? [{ href: link.href, label: link.label }] : [];
});

const sanitizeSocialLink = (link: (typeof socialLinks)[number]) => {
    const href = sanitizeUrl(link.href);
    if (!href || !isAllowedExternalUrl(href)) return null;
    return { ...link, href };
};

export const Footer = ({ showSectionNumber = true }: { showSectionNumber?: boolean }) => {
    const { t } = useI18n();
    const { copiedKey, copy } = useCopyFeedback<"email">();
    const emailCopied = copiedKey === "email";

    const safeSocialLinks = socialLinks
        .map(sanitizeSocialLink)
        .filter((link): link is NonNullable<ReturnType<typeof sanitizeSocialLink>> => Boolean(link));

    const handleEmailClick = async (event: MouseEvent<HTMLAnchorElement>) => {
        // Cmd/Ctrl+click keeps the default mailto behaviour.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        const copied = await copy("email", EMAIL);
        if (!copied) window.location.href = `mailto:${EMAIL.toLowerCase()}`;
    };

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.CONTACT_SECTION}>
            <footer id="contact" className="bg-background border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-10 md:pb-12">
                    {/* Section header — numbering only on home (01 Projects / 02 About / 03 Contact) */}
                    <header className="mb-8 md:mb-10">
                        <h2 className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            {showSectionNumber ? t.footer.eyebrow : t.footer.eyebrowPlain}
                        </h2>
                    </header>

                    <div>
                        {/* Giant email — click copies, Cmd/Ctrl+click opens mailto */}
                        <a
                            href={`mailto:${EMAIL.toLowerCase()}`}
                            onClick={handleEmailClick}
                            title={t.footer.emailHint}
                            className="group inline-flex flex-wrap items-baseline font-semibold text-gray-900 dark:text-white hover:text-volt-ink dark:hover:text-volt transition-colors duration-200 text-[clamp(1.75rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
                        >
                            <CopySwap
                                active={emailCopied}
                                className="text-left"
                                idle={
                                    <span className="inline-flex flex-wrap items-baseline">
                                        <span className="whitespace-nowrap">Akbar02work</span>
                                        <span className="inline-flex items-center gap-2 md:gap-4 whitespace-nowrap">
                                            @gmail.com
                                            <Copy
                                                className="flex-none w-[0.6em] h-[0.6em] translate-y-[0.06em] text-volt-ink dark:text-volt"
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </span>
                                }
                                done={
                                    <span className="inline-flex items-center gap-3 md:gap-4 whitespace-nowrap self-center text-volt-ink dark:text-volt">
                                        {t.footer.copied}
                                        <CircleCheck className="flex-none w-[0.72em] h-[0.72em]" strokeWidth={2} aria-hidden="true" />
                                    </span>
                                }
                            />
                        </a>
                        <span className="sr-only" aria-live="polite">
                            {emailCopied ? t.contact.emailCopied : ""}
                        </span>

                        {/* Social pills */}
                        <nav className="mt-8 md:mt-10 flex flex-wrap items-center gap-4" aria-label={t.footer.socialLinks}>
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
                        {t.footer.credit}
                    </p>
                </div>
            </footer>
        </AnimatedSection>
    );
};
