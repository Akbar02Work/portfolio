import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { buildProjectUrl } from "@/constants/routes";
import type { useProjectsMenu } from "@/hooks/useProjectsMenu";
import { ThemeMenu } from "./ThemeMenu";
import { VersionSwitch } from "./VersionSwitch";
import { navLinks, type NavLinkId } from "./navigation";

type DesktopNavProps = {
  activeSection: NavLinkId | "";
  handleNavItemClick: (sectionId: NavLinkId) => void;
  closeMobileMenu: () => void;
  projectsMenu: ReturnType<typeof useProjectsMenu>;
};

export const DesktopNav = ({
  activeSection,
  handleNavItemClick,
  closeMobileMenu,
  projectsMenu,
}: DesktopNavProps) => (
  <>
    {/* True center — section links only.
        pointer-events-none on the absolute shell so it can't steal hits from
        right-side utilities (theme / version) when the centered row is wide. */}
    <ul className="pointer-events-none hidden md:flex absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex-row items-center space-x-8">
      {navLinks.map((link) => {
        const isActive = activeSection === link.id;
        if (link.id === "projects") {
          return (
            <li
              key={link.id}
              className="pointer-events-auto relative group after:content-[''] after:absolute after:left-0 after:right-0 after:top-full after:h-6"
              onMouseEnter={projectsMenu.openProjectsMenu}
              onMouseLeave={projectsMenu.scheduleCloseProjectsMenu}
              onFocus={projectsMenu.openProjectsMenu}
              onBlur={projectsMenu.handleProjectsBlur}
            >
              <button
                type="button"
                onClick={() => handleNavItemClick(link.id)}
                onKeyDown={projectsMenu.handleProjectsKeyDown}
                ref={projectsMenu.projectsTriggerRef}
                aria-haspopup="menu"
                aria-expanded={projectsMenu.isProjectsMenuOpen}
                aria-controls="projects-menu"
                className={`relative block py-2 px-3 transition-colors inline-flex items-center gap-1 after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-0.5 after:h-[2px] after:rounded-full after:bg-volt-ink dark:after:bg-volt after:transition-transform after:duration-300 after:ease-out after:origin-left ${isActive
                  ? "text-[0.9375rem] font-semibold text-black dark:text-white after:scale-x-100"
                  : "text-[0.9375rem] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white after:scale-x-0"
                  }`}
              >
                {link.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div
                id="projects-menu"
                role="menu"
                aria-label="Projects"
                aria-hidden={!projectsMenu.isProjectsMenuOpen}
                ref={projectsMenu.projectsMenuRef}
                onKeyDown={projectsMenu.handleProjectsMenuKeyDown}
                onMouseEnter={projectsMenu.openProjectsMenu}
                onMouseLeave={projectsMenu.scheduleCloseProjectsMenu}
                className={`absolute left-1/2 top-full z-50 mt-5 w-max min-w-full -translate-x-1/2 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all duration-200 ease-out overflow-hidden before:content-[''] before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:bg-white/80 dark:before:bg-black/80 before:backdrop-blur-2xl ${projectsMenu.isProjectsMenuOpen
                  ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                  : "opacity-0 pointer-events-none translate-y-2 scale-[0.98]"
                  }`}
              >
                <div className="py-0">
                  {projectsMenu.projectMenu.map((project) => (
                    <Link
                      key={project.slug}
                      to={buildProjectUrl(project.slug)}
                      onClick={() => {
                        closeMobileMenu();
                        projectsMenu.closeProjectsMenuNow();
                      }}
                      role="menuitem"
                      tabIndex={projectsMenu.isProjectsMenuOpen ? 0 : -1}
                      className="block whitespace-nowrap px-3.5 py-2.5 text-body-sm text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800/70 transition-colors first:pt-3 last:pb-3"
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
          <li key={link.id} className="pointer-events-auto">
            <button
              type="button"
              onClick={() => handleNavItemClick(link.id)}
              className={`relative block py-2 px-3 transition-colors after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-0.5 after:h-[2px] after:rounded-full after:bg-volt-ink dark:after:bg-volt after:transition-transform after:duration-300 after:ease-out after:origin-left ${isActive
                ? "text-[0.9375rem] font-semibold text-black dark:text-white after:scale-x-100"
                : "text-[0.9375rem] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white after:scale-x-0"
                }`}
            >
              {link.label}
            </button>
          </li>
        );
      })}
    </ul>

    {/* Right utilities */}
    <div className="relative z-20 hidden md:flex items-center gap-3 ml-auto">
      <VersionSwitch />
      <ThemeMenu />
    </div>
  </>
);
