import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/i18n/useI18n";

export const ThemeMenu = ({ direction = "down" }: { direction?: "up" | "down" }) => {
  const { theme, mode, setTheme } = useTheme();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const openAtLastRef = useRef(false);
  // Hover opens without stealing focus; click/keyboard moves focus into the menu.
  const focusOnOpenRef = useRef(true);
  const openedByHoverRef = useRef(false);
  const hoverCloseTimerRef = useRef<number | null>(null);

  const clearHoverClose = useCallback(() => {
    if (hoverCloseTimerRef.current !== null) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearHoverClose();
    openedByHoverRef.current = false;
    setIsOpen(false);
  }, [clearHoverClose]);

  useEffect(() => clearHoverClose, [clearHoverClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (focusOnOpenRef.current) {
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      items?.[openAtLastRef.current ? items.length - 1 : 0]?.focus();
    }

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
  }, [closeMenu, isOpen]);

  const applyTheme = (nextMode: "light" | "dark" | "system") => {
    setTheme(nextMode);
    closeMenu();
    triggerRef.current?.focus();
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
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu();
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        clearHoverClose();
        if (isOpen) return;
        focusOnOpenRef.current = false;
        openAtLastRef.current = false;
        openedByHoverRef.current = true;
        setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse" || !openedByHoverRef.current) return;
        clearHoverClose();
        hoverCloseTimerRef.current = window.setTimeout(closeMenu, 220);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          openAtLastRef.current = false;
          focusOnOpenRef.current = true;
          if (openedByHoverRef.current) {
            // Clicking a hover-opened menu pins it instead of closing it.
            // (Read the ref, not state: the hover update may not be rendered yet.)
            openedByHoverRef.current = false;
            clearHoverClose();
            setIsOpen(true);
            return;
          }
          openedByHoverRef.current = false;
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          openAtLastRef.current = event.key === "ArrowUp";
          focusOnOpenRef.current = true;
          openedByHoverRef.current = false;
          setIsOpen(true);
          if (isOpen) {
            const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
            items?.[openAtLastRef.current ? items.length - 1 : 0]?.focus();
          }
        }}
        aria-label={t.theme.select}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="touch-no-ring p-2.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
      >
        {triggerIcon}
      </button>

      <div
        id={menuId}
        ref={menuRef}
        role="menu"
        onKeyDown={(event) => {
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
          const index = items.indexOf(document.activeElement as HTMLElement);
          let nextIndex: number;
          if (event.key === "ArrowDown") nextIndex = (index + 1) % items.length;
          else if (event.key === "ArrowUp") nextIndex = (index - 1 + items.length) % items.length;
          else if (event.key === "Home") nextIndex = 0;
          else if (event.key === "End") nextIndex = items.length - 1;
          else return;
          event.preventDefault();
          items[nextIndex]?.focus();
        }}
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
              {t.theme.light}
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
              {t.theme.dark}
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
              {t.theme.system}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
