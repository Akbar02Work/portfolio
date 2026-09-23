import { useRef, useState } from "react";
import { ContactDialog } from "@/components/contact/ContactDialog";
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
import { projectsSummaryByLocale } from "@/data/projectsSummary";
import { useI18n } from "@/i18n/useI18n";
import { stripLocale } from "@/i18n/locales";
import { getCreativeUrl } from "@/constants/siteVersions";
import { LogoMark } from "@/components/layout/navbar/LogoMark";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useBlink } from "@/hooks/useBlink";
import { useEasterLogo } from "@/hooks/useEasterLogo";
import { useProjectsMenu } from "@/hooks/useProjectsMenu";
import { scrollBehavior } from "@/lib/motion";

type NavbarProps = {
  variant?: "home" | "detail";
};

export const Navbar = ({ variant = "home" }: NavbarProps) => {
  const isUnderscoreVisible = useBlink();
  const isHome = variant === "home";
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, localize } = useI18n();
  const homePath = localize(ROUTES.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contactReturnFocusRef = useRef<HTMLElement | null>(null);

  const { activeSection, setActiveSection } = useActiveSection<NavLinkId>({
    isHome,
    pathname: location.pathname,
    sectionIds: navSectionIds,
    detailSection: getDetailActiveSection(location.pathname),
    homeSection: "home",
    offsetPx: SCROLL_SPY_OFFSET_PX,
  });

  const projectsMenu = useProjectsMenu({ projects: projectsSummaryByLocale[locale] });

  const { handleLogoClick } = useEasterLogo({
    pathname: location.pathname,
    homePath,
    // Three clicks on the logo open Creative mode (a separate app).
    onUnlock: () => window.location.assign(getCreativeUrl()),
  });

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: scrollBehavior() });
    }
  };

  const handleNavItemClick = (sectionId: NavLinkId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    projectsMenu.closeProjectsMenuNow();
    if (stripLocale(location.pathname) === ROUTES.HOME) {
      scrollToSection(sectionId);
    } else {
      navigate(homePath, { state: { scrollTo: sectionId } });
    }
  };

  const openContact = (returnFocusTo: HTMLElement | null) => {
    contactReturnFocusRef.current = returnFocusTo;
    setMobileMenuOpen(false);
    setMobileProjectsOpen(false);
    projectsMenu.closeProjectsMenuNow();
    setContactOpen(true);
  };

  const navPosition = isHome ? "fixed" : "sticky";

  return (
    <nav
      className={`${navPosition} w-full z-50 top-0 start-0 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-[86rem] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={homePath}
            state={{ scrollTo: "home" }}
            onClick={handleLogoClick}
            className="relative z-10 flex items-center space-x-3"
          >
            <LogoMark isUnderscoreVisible={isUnderscoreVisible} size="nav" />
          </Link>

          <DesktopNav
            activeSection={activeSection}
            handleNavItemClick={handleNavItemClick}
            closeMobileMenu={() => setMobileMenuOpen(false)}
            projectsMenu={projectsMenu}
            onContactClick={openContact}
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
            projectMenu={projectsMenu.projectMenu}
            onContactClick={openContact}
          />
        </div>
      </div>
      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        returnFocusRef={contactReturnFocusRef}
      />
    </nav>
  );
};
