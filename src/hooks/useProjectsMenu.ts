import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import type { ProjectSummary } from "@/data/projectsSummary";

type UseProjectsMenuOptions = {
  projects: ProjectSummary[];
  closeDelayMs?: number;
};

export const useProjectsMenu = ({
  projects,
  closeDelayMs = 220,
}: UseProjectsMenuOptions) => {
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const projectsMenuRef = useRef<HTMLDivElement | null>(null);
  const projectsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const openProjectsMenu = useCallback(() => {
    clearCloseTimer();
    setIsProjectsMenuOpen(true);
  }, [clearCloseTimer]);

  const closeProjectsMenuNow = useCallback(() => {
    clearCloseTimer();
    setIsProjectsMenuOpen(false);
  }, [clearCloseTimer]);

  const scheduleCloseProjectsMenu = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsProjectsMenuOpen(false);
    }, closeDelayMs);
  }, [clearCloseTimer, closeDelayMs]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const focusFirstProjectItem = useCallback(() => {
    const firstItem =
      projectsMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  }, []);

  const handleProjectsBlur = useCallback(
    (event: FocusEvent<HTMLLIElement>) => {
      const nextFocus = event.relatedTarget as Node | null;
      if (!event.currentTarget.contains(nextFocus)) {
        closeProjectsMenuNow();
      }
    },
    [closeProjectsMenuNow]
  );

  const handleProjectsKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openProjectsMenu();
        window.requestAnimationFrame(focusFirstProjectItem);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeProjectsMenuNow();
      }
    },
    [closeProjectsMenuNow, focusFirstProjectItem, openProjectsMenu]
  );

  const handleProjectsMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProjectsMenuNow();
        projectsTriggerRef.current?.focus();
      }
    },
    [closeProjectsMenuNow]
  );

  return {
    projectMenu: projects,
    isProjectsMenuOpen,
    openProjectsMenu,
    closeProjectsMenuNow,
    scheduleCloseProjectsMenu,
    projectsMenuRef,
    projectsTriggerRef,
    handleProjectsBlur,
    handleProjectsKeyDown,
    handleProjectsMenuKeyDown,
  };
};
