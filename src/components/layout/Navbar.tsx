import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, SunMoon, ChevronDown, ChevronRight, X } from "lucide-react";
import { useBlink } from "@/hooks/useBlink";
import { useTheme } from "@/hooks/useTheme";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useProjectsMenu } from "@/hooks/useProjectsMenu";
import { useEasterLogo } from "@/hooks/useEasterLogo";
import { ROUTES, PROJECT_DETAIL_PREFIX, buildProjectUrl } from "@/constants/routes";
import { projectsSummary } from "@/data/projectsSummary";
import { SCROLL_SPY_OFFSET_PX } from "@/constants/ui.constants";
import {
  Sheet,
  SheetClose,
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
] as const;

type NavLinkId = (typeof navLinks)[number]["id"];

const navSectionIds = navLinks.map((link) => link.id) as NavLinkId[];

const getDetailActiveSection = (pathname: string): NavLinkId | "" =>
  pathname.startsWith(PROJECT_DETAIL_PREFIX) ? "projects" : "";

type NavbarProps = {
  variant?: "home" | "detail";
};

const ThemeMenu = ({ direction = "down" }: { direction?: "up" | "down" }) => {
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
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
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
    <div className={`relative group after:content-[''] after:absolute after:left-0 after:right-0 ${direction === "down" ? "after:top-full after:h-6" : "after:bottom-full after:h-6"}`}>
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
        aria-hidden={!isOpen}
        className={`absolute right-0 z-50 w-36 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all duration-200 ease-out overflow-hidden before:content-[''] before:absolute before:left-0 before:h-6 before:w-full before:bg-white/80 dark:before:bg-black/80 before:backdrop-blur-2xl ${direction === "down"
          ? "top-full mt-5 before:-top-6"
          : "bottom-full mb-5 before:-bottom-6"
          } ${isOpen
            ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
            : `opacity-0 pointer-events-none scale-[0.98] ${direction === "down" ? "translate-y-2" : "-translate-y-2"}`
          }`}
      >
        <div className="py-0">
          <button
            type="button"
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            className={itemClass("light")}
            onClick={() => applyTheme("light")}
          >
            <span className="inline-flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Light
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            className={itemClass("dark")}
            onClick={() => applyTheme("dark")}
          >
            <span className="inline-flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Dark
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            className={itemClass("system")}
            onClick={() => applyTheme("system")}
          >
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
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [mobileProjectsHeight, setMobileProjectsHeight] = useState(0);
  const mobileProjectsContentRef = useRef<HTMLDivElement | null>(null);

  const { activeSection, setActiveSection } = useActiveSection<NavLinkId>({
    isHome,
    pathname: location.pathname,
    sectionIds: navSectionIds,
    detailSection: getDetailActiveSection(location.pathname),
    homeSection: "home",
    bottomSectionId: "contact",
    offsetPx: SCROLL_SPY_OFFSET_PX,
  });

  const {
    projectMenu,
    isProjectsMenuOpen,
    openProjectsMenu,
    closeProjectsMenuNow,
    scheduleCloseProjectsMenu,
    projectsMenuRef,
    projectsTriggerRef,
    handleProjectsBlur,
    handleProjectsKeyDown,
    handleProjectsMenuKeyDown,
  } = useProjectsMenu({ projects: projectsSummary });

  const { handleLogoClick } = useEasterLogo({
    pathname: location.pathname,
    homePath: ROUTES.HOME,
    easterPath: ROUTES.EASTER,
    navigate,
  });


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

  const handleNavItemClick = (sectionId: NavLinkId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    closeProjectsMenuNow();
    if (location.pathname === ROUTES.HOME) {
      scrollToSection(sectionId);
    } else {
      navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
    }
  };

  const navPosition = isHome ? "fixed" : "sticky";

  useEffect(() => {
    const updateMobileProjectsHeight = () => {
      setMobileProjectsHeight(mobileProjectsContentRef.current?.scrollHeight ?? 0);
    };

    updateMobileProjectsHeight();
    window.addEventListener("resize", updateMobileProjectsHeight);
    return () => window.removeEventListener("resize", updateMobileProjectsHeight);
  }, [projectMenu.length, mobileMenuOpen]);

  return (
    <nav
      className={`${navPosition} w-full z-50 top-0 start-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={ROUTES.HOME}
            state={{ scrollTo: "home" }}
            onClick={handleLogoClick}
            className="flex items-center space-x-3"
          >
            <span className="self-center text-lg font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white">
              &lt;Aka
              <span
                style={{
                  opacity: isUnderscoreVisible ? 1 : 0,
                  transition: "opacity 0.1s",
                }}
              >
                _
              </span>
              /Portfolio/&gt;
            </span>
          </Link>

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
                      onMouseLeave={scheduleCloseProjectsMenu}
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
                        aria-hidden={!isProjectsMenuOpen}
                        ref={projectsMenuRef}
                        onKeyDown={handleProjectsMenuKeyDown}
                        onMouseEnter={openProjectsMenu}
                        onMouseLeave={scheduleCloseProjectsMenu}
                        className={`absolute left-1/2 top-full z-50 mt-5 w-56 -translate-x-1/2 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all duration-200 ease-out overflow-hidden before:content-[''] before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:bg-white/80 dark:before:bg-black/80 before:backdrop-blur-2xl ${isProjectsMenuOpen
                          ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                          : "opacity-0 pointer-events-none translate-y-2 scale-[0.98]"
                          }`}
                      >
                        <div className="py-0">
                          {projectMenu.map((project) => (
                            <Link
                              key={project.slug}
                              to={buildProjectUrl(project.slug)}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                closeProjectsMenuNow();
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

            <ThemeMenu />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={(open) => {
              setMobileMenuOpen(open);
              if (!open) {
                setMobileProjectsOpen(false);
              }
            }}>
              <SheetTrigger asChild>
                <button
                  className="text-gray-500 dark:text-slate-400 p-2 w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="!w-full !max-w-full !inset-0 bg-white dark:bg-slate-950 border-none flex flex-col [&>button:last-child]:hidden"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Mobile navigation menu</SheetDescription>
                </SheetHeader>

                {/* ── Header: Logo + Close ── */}
                <div className="flex items-center justify-between px-6 pt-[clamp(1rem,3vh,2rem)] pb-2">
                  <Link
                    to={ROUTES.HOME}
                    state={{ scrollTo: "home" }}
                    onClick={(e) => {
                      handleLogoClick(e);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center"
                  >
                    <span className="text-[clamp(1rem,2.5vh,1.5rem)] font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white">
                      &lt;Aka
                      <span
                        style={{
                          opacity: isUnderscoreVisible ? 1 : 0,
                          transition: "opacity 0.1s",
                        }}
                      >
                        _
                      </span>
                      /Portfolio/&gt;
                    </span>
                  </Link>
                  <SheetClose className="p-[clamp(0.25rem,1vh,0.5rem)] rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <X className="w-[clamp(1.25rem,3vh,2rem)] h-[clamp(1.25rem,3vh,2rem)]" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>

                {/* ── Nav Links ── */}
                <nav className="flex-1 flex flex-col justify-center px-10 gap-[clamp(0.25rem,1.5vh,1rem)]">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id;
                    const isProjects = link.id === "projects";

                    return (
                      <div key={link.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (isProjects) {
                              setMobileProjectsOpen((prev) => !prev);
                            } else {
                              handleNavItemClick(link.id);
                            }
                          }}
                          className={`relative flex items-center gap-[clamp(0.5rem,2vw,1rem)] py-[clamp(0.25rem,1vh,0.75rem)] transition-colors text-left ${isActive
                            ? "text-[clamp(1.75rem,5vh,3rem)] font-bold text-gray-900 dark:text-white"
                            : "text-[clamp(1.75rem,5vh,3rem)] font-light text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
                            }`}
                        >
                          {/* Active dot marker */}
                          {isActive && (
                            <span
                              className="absolute -left-[clamp(1rem,4vw,2rem)] w-[clamp(0.4rem,1.2vh,0.75rem)] h-[clamp(0.4rem,1.2vh,0.75rem)] rounded-full bg-gray-900 dark:bg-white animate-in zoom-in duration-300"
                            />
                          )}
                          <span>
                            {link.label}
                          </span>
                          {isProjects && (
                            <ChevronRight
                              className={`w-[clamp(1.25rem,4vh,2rem)] h-[clamp(1.25rem,4vh,2rem)] ml-[clamp(0.25rem,1vw,1rem)] transition-transform duration-300 ${mobileProjectsOpen ? "rotate-90" : ""
                                } ${isActive
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-slate-500"
                                }`}
                            />
                          )}
                        </button>

                        {/* Projects accordion */}
                        {isProjects && (
                          <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                              maxHeight: mobileProjectsOpen
                                ? `${mobileProjectsHeight}px`
                                : "0",
                              opacity: mobileProjectsOpen ? 1 : 0,
                            }}
                          >
                            <div
                              ref={mobileProjectsContentRef}
                              className="pl-[clamp(1.5rem,6vw,3rem)] pt-[clamp(0.1rem,0.5vh,0.5rem)] pb-[clamp(0.25rem,1vh,1rem)] flex flex-col gap-[clamp(0.2rem,0.5vh,0.5rem)]"
                            >
                              {projectMenu.map((project) => (
                                <Link
                                  key={project.slug}
                                  to={buildProjectUrl(project.slug)}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileProjectsOpen(false);
                                  }}
                                  className="text-[clamp(1rem,3vh,1.5rem)] text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors py-[clamp(0.25rem,1vh,0.75rem)]"
                                >
                                  {project.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>

                {/* ── Bottom: Text + Theme ── */}
                <div className="px-6 pb-[clamp(1rem,4vh,2rem)] pt-[clamp(0.5rem,2vh,1.5rem)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[clamp(0.65rem,1.5vh,0.875rem)] font-medium text-gray-400 dark:text-slate-500">
                      Designed &amp; built by Akbar
                    </p>

                    <ThemeMenu direction="up" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
