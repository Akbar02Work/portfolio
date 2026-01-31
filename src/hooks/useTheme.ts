import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme") as Theme | null;
            if (stored) return stored;

            // Check system preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            const stored = localStorage.getItem("theme");
            // Only auto-switch if user hasn't manually chosen
            if (!stored) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme, setTheme };
}
