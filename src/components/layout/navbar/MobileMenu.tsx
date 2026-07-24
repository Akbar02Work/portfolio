import type {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
} from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES, buildProjectUrl } from "@/constants/routes";
import type { ProjectSummary } from "@/data/projectsSummary";
import { ThemeMenu } from "./ThemeMenu";
import { VersionSwitch } from "./VersionSwitch";
import { navLinks, type NavLinkId } from "./navigation";

type MobileMenuProps = {
  activeSection: NavLinkId | "";
  handleLogoClick: MouseEventHandler<HTMLAnchorElement>;
  handleNavItemClick: (sectionId: NavLinkId) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  mobileProjectsOpen: boolean;
  setMobileProjectsOpen: Dispatch<SetStateAction<boolean>>;
  mobileProjectsHeight: number;
  mobileProjectsContentRef: RefObject<HTMLDivElement>;
  projectMenu: ProjectSummary[];
};

export const MobileMenu = ({
  activeSection,
  handleLogoClick,
  handleNavItemClick,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileProjectsOpen,
  setMobileProjectsOpen,
  mobileProjectsHeight,
  mobileProjectsContentRef,
  projectMenu,
}: MobileMenuProps) => (
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
            <span className="font-mono text-[clamp(1rem,2.5vh,1.5rem)] font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white">
              &lt;Aka
              <span className="motion-safe:animate-pulse">_</span>
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
                  aria-expanded={isProjects ? mobileProjectsOpen : undefined}
                  aria-controls={isProjects ? "mobile-project-links" : undefined}
                  className={`relative flex items-center gap-[clamp(0.5rem,2vw,1rem)] py-[clamp(0.25rem,1vh,0.75rem)] transition-colors text-left ${isActive
                    ? "text-[clamp(1.75rem,5vh,3rem)] font-bold text-gray-900 dark:text-white"
                    : "text-[clamp(1.75rem,5vh,3rem)] font-light text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
                    }`}
                >
                  {/* Active dot marker */}
                  {isActive && (
                    <span
                      className="absolute -left-[clamp(1rem,4vw,2rem)] w-[clamp(0.4rem,1.2vh,0.75rem)] h-[clamp(0.4rem,1.2vh,0.75rem)] rounded-full bg-volt-ink dark:bg-volt animate-in zoom-in duration-300"
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
                    id="mobile-project-links"
                    aria-hidden={!mobileProjectsOpen}
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
                          tabIndex={mobileProjectsOpen ? 0 : -1}
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

        {/* ── Bottom: Version + Theme ── */}
        <div className="px-6 pb-[clamp(1rem,4vh,2rem)] pt-[clamp(0.5rem,2vh,1.5rem)]">
          <div className="flex items-center justify-between gap-3">
            <VersionSwitch />
            <ThemeMenu direction="up" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
);
