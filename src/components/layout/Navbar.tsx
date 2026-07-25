import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DesktopNav } from "@/components/layout/navbar/DesktopNav";
import { MobileMenu } from "@/components/layout/navbar/MobileMenu";
import {
  getDetailActiveSection,
  navSectionIds,
  type NavLinkId,
} from "@/components/layout/navbar/navigation";
import { ROUTES } from "@/constants/routes";
import { SCROLL_SPY_OFFSET_PX } from "@/constants/ui.constants";
import { projectsSummary } from "@/data/projectsSummary";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useBlink } from "@/hooks/useBlink";
import { useEasterLogo } from "@/hooks/useEasterLogo";
import { useProjectsMenu } from "@/hooks/useProjectsMenu";

type NavbarProps = {
  variant?: "home" | "detail";
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

  const projectsMenu = useProjectsMenu({ projects: projectsSummary });

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
    projectsMenu.closeProjectsMenuNow();
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
  }, [projectsMenu.projectMenu.length, mobileMenuOpen]);

  return (
    <nav
      className={`${navPosition} w-full z-50 top-0 start-0 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-[86rem] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={ROUTES.HOME}
            state={{ scrollTo: "home" }}
            onClick={handleLogoClick}
            className="relative z-10 flex items-center space-x-3"
          >
            <span className="self-center font-mono text-lg font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white">
              &lt;Aka
              <span style={{ opacity: isUnderscoreVisible ? 1 : 0 }}>_</span>
              /Portfolio/&gt;
            </span>
          </Link>

          <DesktopNav
            activeSection={activeSection}
            handleNavItemClick={handleNavItemClick}
            closeMobileMenu={() => setMobileMenuOpen(false)}
            projectsMenu={projectsMenu}
          />

          <MobileMenu
            activeSection={activeSection}
            handleLogoClick={handleLogoClick}
            handleNavItemClick={handleNavItemClick}
            isUnderscoreVisible={isUnderscoreVisible}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            mobileProjectsOpen={mobileProjectsOpen}
            setMobileProjectsOpen={setMobileProjectsOpen}
            mobileProjectsHeight={mobileProjectsHeight}
            mobileProjectsContentRef={mobileProjectsContentRef}
            projectMenu={projectsMenu.projectMenu}
          />
        </div>
      </div>
    </nav>
  );
};
