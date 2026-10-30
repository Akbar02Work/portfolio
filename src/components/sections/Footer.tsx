import { LocalizedText } from "@/components/ui/LocalizedText";
import { useState, type MouseEvent } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CopySwap } from "@/components/ui/CopySwap";
import { useCopyFeedback } from "@/hooks/useCopyFeedback";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";
import { ArrowUpRight, CircleCheck, Copy } from "lucide-react";
import { CONTACT_EMAIL, contactLinks, footerLinkOrder } from "@/data/contacts";
import { useI18n } from "@/i18n/useI18n";
import { BackToTop } from "@/components/BackToTop";

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
    const { copiedKeys, checkedKeys, copy } = useCopyFeedback<"email">();
    const emailCopied = copiedKeys.has("email");
    const [copyFailed, setCopyFailed] = useState(false);

    const safeSocialLinks = socialLinks
        .map(sanitizeSocialLink)
        .filter((link): link is NonNullable<ReturnType<typeof sanitizeSocialLink>> => Boolean(link));

    const handleCopyEmail = async () => {
        setCopyFailed(false);
        const copied = await copy("email", EMAIL);
        setCopyFailed(!copied);
    };

    const handleEmailClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || emailCopied) return;
        event.preventDefault();
        void handleCopyEmail();
    };

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.CONTACT_SECTION}>
            <footer id="contact" className="bg-background border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-10 md:pb-12">
                    {/* Section header — numbering only on home (01 Projects / 02 About / 03 Contact) */}
                    <header className="mb-8 md:mb-10">
                        <h2 className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            <LocalizedText scramble>{copy => showSectionNumber ? copy.footer.eyebrow : copy.footer.eyebrowPlain}</LocalizedText>
                        </h2>
                    </header>

                    <div>
                        <a
                            href={`mailto:${EMAIL.toLowerCase()}`}
                            onClick={handleEmailClick}
                            aria-label={emailCopied ? t.contact.emailAria(EMAIL) : t.contact.emailCopyAria(EMAIL)}
                            className="group inline-flex flex-wrap items-baseline font-semibold text-gray-900 dark:text-white hover:text-volt-ink dark:hover:text-volt transition-colors duration-200 text-[clamp(1.75rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
                        >
                            <span className="whitespace-nowrap">Akbar02work</span>
                            <span className="inline-flex items-center gap-2 md:gap-4 whitespace-nowrap">
                                @gmail.com
                                <CopySwap
                                    active={checkedKeys.has("email")}
                                    className="translate-y-[0.06em] md:translate-y-0"
                                    idle={emailCopied
                                        ? <ArrowUpRight className="w-[0.6em] h-[0.6em] text-volt-ink dark:text-volt" strokeWidth={2} aria-hidden="true" />
                                        : <Copy className="w-[0.6em] h-[0.6em] text-volt-ink dark:text-volt" strokeWidth={2} aria-hidden="true" />}
                                    done={<CircleCheck className="w-[0.6em] h-[0.6em] text-volt-ink dark:text-volt" strokeWidth={2} aria-hidden="true" />}
                                />
                            </span>
                        </a>
                        <span className="sr-only" aria-live="polite">
                            {checkedKeys.has("email") ? t.contact.emailCopied : ""}
                        </span>
                        {copyFailed ? (
                            <p role="alert" className="mt-4 text-body-sm text-gray-600 dark:text-slate-300">
                                <LocalizedText>{copy => copy.contact.emailCopyFailed}</LocalizedText>
                            </p>
                        ) : null}

                        {/* Social pills */}
                        <nav className="mt-8 md:mt-10 flex flex-wrap items-center gap-4" aria-label={t.footer.socialLinks}>
                            {safeSocialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t.contact.linkOpenAria(link.label)}
                                    className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 font-mono text-sm uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 hover:border-volt-ink dark:hover:border-volt hover:text-volt-ink dark:hover:text-volt transition-colors"
                                >
                                    {link.label}
                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} aria-hidden="true" />
                                </a>
                            ))}
                        </nav>

                    </div>
                </div>
                <div className="site-footer-bottom border-t border-neutral-200 dark:border-neutral-800 py-6">
                    <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center gap-4">
                        <p className="w-full min-w-0 text-center font-mono text-caption uppercase tracking-[0.2em] text-neutral-500">
                            <LocalizedText>{copy => copy.footer.credit}</LocalizedText>
                        </p>
                        <BackToTop placement="footer" />
                    </div>
                </div>
            </footer>
        </AnimatedSection>
    );
};
