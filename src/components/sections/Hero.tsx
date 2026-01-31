import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Download, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contacts" },
];

export const Hero = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Glass Header */}
            <nav className="fixed w-full z-50 top-0 start-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-lg border-b border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="#" className="flex items-center space-x-3">
                            <span className="self-center text-xl font-bold whitespace-nowrap uppercase tracking-wider text-gray-900 dark:text-white">
                                &lt;Dev. Portfolio /&gt;
                            </span>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <ul className="font-medium flex flex-row space-x-8">
                                <li>
                                    <a href="#home" className="block py-2 px-3 text-black dark:text-white font-semibold">Home</a>
                                </li>
                                <li>
                                    <a href="#about" className="block py-2 px-3 text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">About</a>
                                </li>
                                <li>
                                    <a href="#projects" className="block py-2 px-3 text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">Projects</a>
                                </li>
                                <li>
                                    <a href="#contact" className="block py-2 px-3 text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">Contacts</a>
                                </li>
                            </ul>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </button>

                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="text-gray-500 dark:text-slate-400 p-2 w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" aria-label="Open menu">
                                        <Menu className="w-5 h-5" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                                    <SheetHeader>
                                        <SheetTitle className="text-gray-900 dark:text-white">Menu</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-4 mt-8">
                                        {navLinks.map((link) => (
                                            <a
                                                key={link.href}
                                                href={link.href}
                                                onClick={handleNavClick}
                                                className="text-lg text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors py-2"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Mesh Gradient */}
            <section
                id="home"
                className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden hero-gradient dark:bg-slate-950"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8f9fa] dark:to-slate-950 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-gray-900 dark:text-white">
                                I'm <span className="underline decoration-4 decoration-gray-400 dark:decoration-slate-500 underline-offset-8">Akbar Azizov</span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">
                                    Android Developer
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-lg mx-auto md:mx-0 font-medium">
                                Building AI-Powered Mobile Apps
                            </p>
                            <p className="text-lg text-gray-500 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
                                Engineering reliable, privacy-aware AI integrations for mobile. Bridging the gap between LLMs and Android production code.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 w-full sm:w-auto">
                                <a
                                    href="#projects"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-90 transition-opacity text-center flex items-center justify-center"
                                >
                                    Selected Works
                                </a>
                                <a
                                    href="/CV_Akbar_Azizov_Kotlin&Compose_EN.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 px-6 bg-transparent border border-gray-900 dark:border-slate-500 text-gray-900 dark:text-slate-200 font-medium rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    Download CV
                                    <Download className="w-4 h-4" strokeWidth={2} />
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end relative">
                            <div className="w-80 h-auto md:w-[380px] relative">
                                <img
                                    src="/avatar.png"
                                    alt="Akbar Azizov"
                                    loading="eager"
                                    className="w-full h-auto object-contain"
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8f9fa] dark:from-slate-950 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
