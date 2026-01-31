import { AnimatedSection } from "@/components/AnimatedSection";
import { ANIMATION_DELAYS } from "@/constants/animation.constants";
import { Mail, Send, Github, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <AnimatedSection delay={ANIMATION_DELAYS.CONTACT_SECTION}>
            <footer id="contact" className="py-16 bg-[#f8f9fa] dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-12">
                        Ready to build something intelligent?
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a
                            href="mailto:akbar02work@gmail.com"
                            className="h-12 flex items-center justify-center gap-2 px-4 border-2 border-blue-500 dark:border-blue-400 rounded-full text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200"
                        >
                            <Mail className="w-5 h-5" strokeWidth={2} />
                            Email Me
                        </a>
                        <a
                            href="https://t.me/Akbar02Work"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 flex items-center justify-center gap-2 px-4 border-2 border-[#0088CC] rounded-full text-[#0088CC] font-medium hover:bg-[#0088CC] hover:text-white transition-all duration-200"
                        >
                            <Send className="w-5 h-5" strokeWidth={2} />
                            Telegram
                        </a>
                        <a
                            href="https://github.com/Akkbar618"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 flex items-center justify-center gap-2 px-4 border-2 border-gray-900 dark:border-slate-400 rounded-full text-gray-900 dark:text-slate-300 font-medium hover:bg-gray-900 dark:hover:bg-slate-700 hover:text-white dark:hover:text-white transition-all duration-200"
                        >
                            <Github className="w-5 h-5" strokeWidth={2} />
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/akbar02work"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 flex items-center justify-center gap-2 px-4 border-2 border-[#0077B5] rounded-full text-[#0077B5] font-medium hover:bg-[#0077B5] hover:text-white transition-all duration-200"
                        >
                            <Linkedin className="w-5 h-5" strokeWidth={2} />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </footer>
        </AnimatedSection>
    );
};
