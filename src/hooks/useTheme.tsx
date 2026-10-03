import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "@/lib/storage";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "theme-mode";
/** Must match public/scripts/theme-init.js and the critical CSS in index.html. */
const ROOT_BACKGROUND: Record<ResolvedTheme, string> = { light: "#FAFAF8", dark: "#0A0A0A" };

const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getStoredMode = (): ThemeMode => {
    const stored = storage.getString(THEME_STORAGE_KEY, "system");
    const normalized = stored.replace(/^"(.*)"$/, "$1");
    if (normalized === "light" || normalized === "dark" || normalized === "system") {
        return normalized;
    }
    return "system";
};

type ThemeContextValue = {
    theme: ResolvedTheme;
    mode: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>(() => getStoredMode());
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        const initialMode = getStoredMode();
        return initialMode === "system" ? getSystemTheme() : initialMode;
    });

    useEffect(() => {
        storage.setString(THEME_STORAGE_KEY, mode);
    }, [mode]);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const apply = () => {
            const nextTheme = mode === "system" ? (mediaQuery.matches ? "dark" : "light") : mode;
            setResolvedTheme(nextTheme);
        };

        apply();
        if (mode !== "system") return;

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", apply);
            return () => mediaQuery.removeEventListener("change", apply);
        }

        const legacyMediaQuery = mediaQuery as MediaQueryList & {
            addListener?: (listener: () => void) => void;
            removeListener?: (listener: () => void) => void;
        };
        legacyMediaQuery.addListener?.(apply);
        return () => legacyMediaQuery.removeListener?.(apply);
    }, [mode]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", resolvedTheme === "dark");
        // Keep the inline styles set by public/scripts/theme-init.js in sync;
        // they outrank the html.dark rules otherwise.
        root.style.colorScheme = resolvedTheme;
        root.style.backgroundColor = ROOT_BACKGROUND[resolvedTheme];
    }, [resolvedTheme]);

    const value = useMemo(
        () => ({ theme: resolvedTheme, mode, setTheme: setMode }),
        [resolvedTheme, mode]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
