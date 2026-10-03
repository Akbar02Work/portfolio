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
import { HiddenVersionsDialog } from "@/components/layout/navbar/HiddenVersionsDialog";
import { LogoMark } from "@/components/layout/navbar/LogoMark";
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
  const { locale, localize } = useI18n();
  const homePath = localize(ROUTES.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const mobileMenuFocusHandoffRef = useRef(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contactReturnFocusRef = useRef<HTMLElement | null>(null);
  const [hiddenVersionsOpen, setHiddenVersionsOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  const { activeSection, setActiveSection, scrollToSection } = useActiveSection<NavLinkId>({
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
    onUnlock: () => {
      if (mobileMenuOpen) mobileMenuFocusHandoffRef.current = true;
      setMobileMenuOpen(false);
      setMobileProjectsOpen(false);
      projectsMenu.closeProjectsMenuNow();
      setHiddenVersionsOpen(true);
    },
  });

  const handleNavItemClick = (sectionId: NavLinkId) => {
    setMobileMenuOpen(false);
    projectsMenu.closeProjectsMenuNow();
    if (stripLocale(location.pathname) === ROUTES.HOME) {
      scrollToSection(sectionId);
    } else {
      setActiveSection(sectionId);
      navigate(homePath, { state: { scrollTo: sectionId } });
    }
  };

  const openContact = (returnFocusTo: HTMLElement | null) => {
    contactReturnFocusRef.current = returnFocusTo;
    if (mobileMenuOpen) mobileMenuFocusHandoffRef.current = true;
    setMobileMenuOpen(false);
    setMobileProjectsOpen(false);
    projectsMenu.closeProjectsMenuNow();
    setContactOpen(true);
  };

  const handleMobileMenuCloseAutoFocus = (event: Event) => {
    if (!mobileMenuFocusHandoffRef.current) return;
    // The sheet's exit animation can finish after the replacement dialog closes.
    event.preventDefault();
    mobileMenuFocusHandoffRef.current = false;
  };

  const navPosition = isHome ? "fixed" : "sticky";

  return (
    <nav
      className={`${navPosition} w-full z-50 top-0 start-0 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative flex flex-wrap items-center justify-between mx-auto py-4">
          <Link
            ref={logoRef}
            to={homePath}
            state={{ scrollTo: "home" }}
            onClick={handleLogoClick}
            className="relative z-10 flex items-center space-x-3"
          >
            <LogoMark isUnderscoreVisible={isUnderscoreVisible} />
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
            onCloseAutoFocus={handleMobileMenuCloseAutoFocus}
          />
        </div>
      </div>
      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        returnFocusRef={contactReturnFocusRef}
      />
      <HiddenVersionsDialog
        open={hiddenVersionsOpen}
        onOpenChange={setHiddenVersionsOpen}
        returnFocusRef={logoRef}
      />
    </nav>
  );
};
