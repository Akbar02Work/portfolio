import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";
import { Mail, Send, Github, Linkedin } from "lucide-react";

const socialLinks = [
    { href: "mailto:akbar02work@gmail.com", icon: Mail, label: "Email", color: "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-500" },
    { href: "https://t.me/Akbar02Work", icon: Send, label: "Telegram", color: "border-[#0088CC] text-[#0088CC] hover:bg-[#0088CC]" },
    { href: "https://www.linkedin.com/in/akbar02work", icon: Linkedin, label: "LinkedIn", color: "border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5]" },
    { href: "https://github.com/Akbar02Work", icon: Github, label: "GitHub", color: "border-gray-900 dark:border-slate-400 text-gray-900 dark:text-slate-300 hover:bg-gray-900 dark:hover:bg-slate-700" },
];

const isDirectContactLink = (href: string) =>
    href.startsWith("mailto:") || href.startsWith("tel:");

const sanitizeSocialLink = (link: (typeof socialLinks)[number]) => {
    const href = sanitizeUrl(link.href);
    if (!href) return null;
    if (!isDirectContactLink(href) && !isAllowedExternalUrl(href)) {
        return null;
    }
    return { ...link, href };
};

export const Footer = () => {
    const safeSocialLinks = socialLinks
        .map(sanitizeSocialLink)
        .filter((link): link is NonNullable<ReturnType<typeof sanitizeSocialLink>> => Boolean(link));

    return (
        <AnimatedSection delay={ANIMATION_DELAYS.CONTACT_SECTION}>
            <footer id="contact" className="pt-16 pb-8 bg-[#f8f9fa] dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-12">
                        Have an idea? Drop me a line
                    </h2>

                    {/* Mobile: Icon-only row | Desktop: Full buttons grid */}
                    <div className="flex flex-wrap justify-center gap-4 md:grid md:grid-cols-4">
                        {safeSocialLinks.map((link) => {
                            const openInNewTab = !isDirectContactLink(link.href);
                            return (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target={openInNewTab ? "_blank" : undefined}
                                    rel={openInNewTab ? "noopener noreferrer" : undefined}
                                    className={`h-12 w-12 md:w-full flex items-center justify-center gap-2 border-2 rounded-full font-medium hover:text-white dark:hover:text-white transition-all duration-200 ${link.color}`}
                                    aria-label={link.label}
                                >
                                    <link.icon className="w-5 h-5" strokeWidth={2} />
                                    {/* Text hidden on mobile, shown on desktop */}
                                    <span className="hidden md:inline">{link.label}</span>
                                </a>
                            );
                        })}
                    </div>

                    <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Crafted with attention to detail
                    </p>
                </div>
            </footer>
        </AnimatedSection>
    );
};
