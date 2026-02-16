import { useEffect, useId, useRef, useState } from "react";
import { useBlink } from "@/hooks/useBlink";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, SunMoon, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ROUTES, PROJECT_DETAIL_PREFIX, buildProjectUrl } from "@/constants/routes";
import { projectsSummary } from "@/data/projectsSummary";
import { SCROLL_SPY_OFFSET_PX } from "@/constants/ui.constants";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
];
const EASTER_CLICKS_REQUIRED = 5;
const EASTER_CLICK_WINDOW_MS = 1600;
type NavLinkId = (typeof navLinks)[number]["id"];
const getDetailActiveSection = (pathname: string): NavLinkId | "" =>
    pathname.startsWith(PROJECT_DETAIL_PREFIX) ? "projects" : "";

type NavbarProps = {
    variant?: "home" | "detail";
};

const ThemeMenu = () => {
    const { theme, mode, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const menuId = useId();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
                return;
            }
            closeMenu();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            closeMenu();
            triggerRef.current?.focus();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const applyTheme = (nextMode: "light" | "dark" | "system") => {
        setTheme(nextMode);
        closeMenu();
    };

    const triggerIcon =
        mode === "system" ? (
            <SunMoon className="w-5 h-5" />
        ) : theme === "light" ? (
            <Sun className="w-5 h-5" />
        ) : (
            <Moon className="w-5 h-5" />
        );

    const itemClass = (value: "light" | "dark" | "system") =>
        `block w-full text-left px-4 py-2.5 text-body-sm transition-colors first:pt-3 last:pb-3 ${mode === value
            ? "text-black dark:text-white font-semibold"
            : "text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800/70"
        }`;

    return (
        <div className="relative group after:content-[''] after:absolute after:left-0 after:right-0 after:top-full after:h-6">
            <button
                ref={triggerRef}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Select theme"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={menuId}
                className="touch-no-ring p-2.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:focus-visible:ring-slate-700"
            >
                {triggerIcon}
            </button>

            <div
                id={menuId}
                ref={menuRef}
                role="menu"
                className={`absolute left-1/2 top-full z-50 mt-5 w-36 -translate-x-1/2 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all duration-200 ease-out overflow-hidden before:content-[''] before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:bg-white/80 dark:before:bg-black/80 before:backdrop-blur-2xl ${isOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none translate-y-2 scale-[0.98]"
                    }`}
            >
                <div className="py-0">
                    <button type="button" role="menuitem" className={itemClass("light")} onClick={() => applyTheme("light")}>
                        <span className="inline-flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Light
                        </span>
                    </button>
                    <button type="button" role="menuitem" className={itemClass("dark")} onClick={() => applyTheme("dark")}>
                        <span className="inline-flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Dark
                        </span>
                    </button>
                    <button type="button" role="menuitem" className={itemClass("system")} onClick={() => applyTheme("system")}>
                        <span className="inline-flex items-center gap-2">
                            <SunMoon className="w-4 h-4" />
                            System
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Navbar = ({ variant = "home" }: NavbarProps) => {
    const isUnderscoreVisible = useBlink();
    const isHome = variant === "home";
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<NavLinkId | "">(
        isHome ? "home" : getDetailActiveSection(location.pathname)
    );
    const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
    const projectMenu = projectsSummary;
    const projectsMenuRef = useRef<HTMLDivElement | null>(null);
    const projectsTriggerRef = useRef<HTMLButtonElement | null>(null);
    const easterClickCountRef = useRef(0);
    const easterResetTimerRef = useRef<number | null>(null);

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    const scrollToSection = (sectionId: string) => {
        if (sectionId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const openProjectsMenu = () => setIsProjectsMenuOpen(true);
    const closeProjectsMenu = () => setIsProjectsMenuOpen(false);

    const handleNavItemClick = (sectionId: string) => {
        setActiveSection(sectionId);
        setMobileMenuOpen(false);
        closeProjectsMenu();
        if (location.pathname === ROUTES.HOME) {
            scrollToSection(sectionId);
        } else {
            navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
        }
    };

    const resetEasterSequence = () => {
        easterClickCountRef.current = 0;
        if (easterResetTimerRef.current !== null) {
            window.clearTimeout(easterResetTimerRef.current);
            easterResetTimerRef.current = null;
        }
    };

    const scheduleEasterReset = () => {
        if (easterResetTimerRef.current !== null) {
            window.clearTimeout(easterResetTimerRef.current);
        }
        easterResetTimerRef.current = window.setTimeout(() => {
            resetEasterSequence();
        }, EASTER_CLICK_WINDOW_MS);
    };

    const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (location.pathname === ROUTES.HOME) {
            event.preventDefault();
            easterClickCountRef.current += 1;
            if (easterClickCountRef.current >= EASTER_CLICKS_REQUIRED) {
                resetEasterSequence();
                navigate(ROUTES.EASTER);
                return;
            }
            scheduleEasterReset();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleProjectsBlur = (event: React.FocusEvent<HTMLLIElement>) => {
        const nextFocus = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(nextFocus)) {
            closeProjectsMenu();
        }
    };

    const focusFirstProjectItem = () => {
        const firstItem = projectsMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
        firstItem?.focus();
    };

    const handleProjectsKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            openProjectsMenu();
            window.requestAnimationFrame(focusFirstProjectItem);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            closeProjectsMenu();
        }
    };

    const handleProjectsMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeProjectsMenu();
            projectsTriggerRef.current?.focus();
        }
    };

    useEffect(() => {
        if (!isHome) {
            const detailDefault = getDetailActiveSection(location.pathname);
            setActiveSection(detailDefault);

            let rafId = 0;
            const handleBottomCheck = () => {
                const contactSection = document.getElementById("contact");
                if (!contactSection) return;
                const isAtBottom =
                    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;
                if (isAtBottom) {
                    setActiveSection((prev) => (prev === "contact" ? prev : "contact"));
                } else {
                    setActiveSection((prev) => (prev === detailDefault ? prev : detailDefault));
                }
            };
            const onScroll = () => {
                if (rafId) return;
                rafId = window.requestAnimationFrame(() => {
                    rafId = 0;
                    handleBottomCheck();
                });
            };

            handleBottomCheck();
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);

            return () => {
                if (rafId) window.cancelAnimationFrame(rafId);
                window.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", onScroll);
            };
        }

        const sections = navLinks
            .map((link) => document.getElementById(link.id))
            .filter((section): section is HTMLElement => Boolean(section));

        if (sections.length === 0) return;

        const offset = SCROLL_SPY_OFFSET_PX;

        if (!("IntersectionObserver" in window)) {
            let rafId = 0;
            const updateActiveSection = () => {
                let closest = sections[0]!;
                let minDistance = Number.POSITIVE_INFINITY;

                for (const section of sections) {
                    const distance = Math.abs(section.getBoundingClientRect().top - offset);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closest = section;
                    }
                }

                const contactSection = document.getElementById("contact");
                const isAtBottom =
                    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
                if (contactSection && isAtBottom) {
                    closest = contactSection;
                }

                setActiveSection((prev) => (prev === closest.id ? prev : closest.id));
            };

            const onScroll = () => {
                if (rafId) return;
                rafId = window.requestAnimationFrame(() => {
                    rafId = 0;
                    updateActiveSection();
                });
            };

            updateActiveSection();
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);

            return () => {
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                }
                window.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", onScroll);
            };
        }

        const sectionStates = new Map<string, { top: number; isIntersecting: boolean }>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    sectionStates.set(entry.target.id, {
                        top: entry.boundingClientRect.top,
                        isIntersecting: entry.isIntersecting,
                    });
                }

                const visibleSections = Array.from(sectionStates.entries()).filter(
                    ([, data]) => data.isIntersecting
                );

                if (visibleSections.length === 0) return;

                visibleSections.sort((a, b) => {
                    return Math.abs(a[1].top - offset) - Math.abs(b[1].top - offset);
                });

                const nextId = visibleSections[0][0];
                setActiveSection((prev) => (prev === nextId ? prev : nextId));
            },
            {
                rootMargin: `-${offset}px 0px -20% 0px`,
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );

        sections.forEach((section) => {
            sectionStates.set(section.id, { top: Number.POSITIVE_INFINITY, isIntersecting: false });
            observer.observe(section);
        });

        let rafId = 0;
        const handleBottomCheck = () => {
            const contactSection = document.getElementById("contact");
            if (!contactSection) return;
            const isAtBottom =
                window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;
            if (isAtBottom) {
                setActiveSection((prev) => (prev === "contact" ? prev : "contact"));
            }
        };
        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = 0;
                handleBottomCheck();
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        handleBottomCheck();

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            observer.disconnect();
        };
    }, [isHome, location.pathname]);

    const navPosition = isHome ? "fixed" : "sticky";

    return (
        <nav className={`${navPosition} w-full z-50 top-0 start-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link
                        to={ROUTES.HOME}
                        state={{ scrollTo: "home" }}
                        onClick={handleLogoClick}
                        className="flex items-center space-x-3"
                    >
                        <span className="self-center text-lg font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white">
                            &lt;Aka<span style={{ opacity: isUnderscoreVisible ? 1 : 0, transition: 'opacity 0.1s' }}>_</span>/Portfolio/&gt;
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex flex-row space-x-8">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                if (link.id === "projects") {
                                    return (
                                        <li
                                            key={link.id}
                                            className="relative group after:content-[''] after:absolute after:left-0 after:right-0 after:top-full after:h-6"
                                            onMouseEnter={openProjectsMenu}
                                            onMouseLeave={closeProjectsMenu}
                                            onFocus={openProjectsMenu}
                                            onBlur={handleProjectsBlur}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleNavItemClick(link.id)}
                                                onKeyDown={handleProjectsKeyDown}
                                                ref={projectsTriggerRef}
                                                aria-haspopup="menu"
                                                aria-expanded={isProjectsMenuOpen}
                                                aria-controls="projects-menu"
                                                className={`block py-2 px-3 transition-colors inline-flex items-center gap-1 ${isActive
                                                    ? "text-[0.9375rem] font-semibold text-black dark:text-white"
                                                    : "text-[0.9375rem] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                                                    }`}
                                            >
                                                {link.label}
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                            <div
                                                id="projects-menu"
                                                role="menu"
                                                aria-label="Projects"
                                                ref={projectsMenuRef}
                                                onKeyDown={handleProjectsMenuKeyDown}
                                                className={`absolute left-1/2 top-full z-50 mt-5 w-56 -translate-x-1/2 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all duration-200 ease-out overflow-hidden before:content-[''] before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:bg-white/80 dark:before:bg-black/80 before:backdrop-blur-2xl ${isProjectsMenuOpen ? "opacity-100 pointer-events-auto translate-y-0 scale-100" : "opacity-0 pointer-events-none translate-y-2 scale-[0.98]"}`}
                                            >
                                                <div className="py-0">
                                                    {projectMenu.map((project) => (
                                                        <Link
                                                            key={project.slug}
                                                            to={buildProjectUrl(project.slug)}
                                                            onClick={() => {
                                                                setMobileMenuOpen(false);
                                                                closeProjectsMenu();
                                                            }}
                                                            role="menuitem"
                                                            tabIndex={isProjectsMenuOpen ? 0 : -1}
                                                            className="block w-full text-left px-4 py-2.5 text-body-sm text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800/70 transition-colors first:pt-3 last:pb-3"
                                                        >
                                                            {project.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={link.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleNavItemClick(link.id)}
                                            className={`block py-2 px-3 transition-colors ${isActive
                                                ? "text-[0.9375rem] font-semibold text-black dark:text-white"
                                                : "text-[0.9375rem] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                                                }`}
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Theme Toggle */}
                        <ThemeMenu />
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeMenu />

                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <button className="text-gray-500 dark:text-slate-400 p-2 w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" aria-label="Open menu">
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                                <SheetHeader>
                                    <SheetTitle className="text-gray-900 dark:text-white">Menu</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Mobile navigation menu
                                    </SheetDescription>
                                </SheetHeader>
                                <nav className="flex flex-col gap-4 mt-8">
                                    {navLinks.map((link) => {
                                        const isActive = activeSection === link.id;
                                        if (link.id === "projects") {
                                            return (
                                                <div key={link.id} className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleNavItemClick(link.id)}
                                                        className={`transition-colors py-2 ${isActive
                                                            ? "text-body-base font-semibold text-black dark:text-white"
                                                            : "text-body-base text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                                                            }`}
                                                    >
                                                        {link.label}
                                                    </button>
                                                    <div className="pl-4 flex flex-col gap-2">
                                                        {projectMenu.map((project) => (
                                                            <Link
                                                                key={project.slug}
                                                                to={buildProjectUrl(project.slug)}
                                                                onClick={handleNavClick}
                                                                className="text-left text-body-sm text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors py-1"
                                                            >
                                                                {project.title}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <button
                                                key={link.id}
                                                type="button"
                                                onClick={() => handleNavItemClick(link.id)}
                                                className={`transition-colors py-2 ${isActive
                                                    ? "text-body-base font-semibold text-black dark:text-white"
                                                    : "text-body-base text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                                                    }`}
                                            >
                                                {link.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};
