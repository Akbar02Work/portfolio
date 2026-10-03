import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

type MatchMediaControl = {
  setMatches: (matches: boolean) => void;
};

const mockMatchMedia = (initialMatches: boolean): MatchMediaControl => {
  let matches = initialMatches;
  const listeners = new Set<() => void>();

  const mediaQuery = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn((_event: string, listener: () => void) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_event: string, listener: () => void) => {
      listeners.delete(listener);
    }),
    addListener: vi.fn((listener: () => void) => {
      listeners.add(listener);
    }),
    removeListener: vi.fn((listener: () => void) => {
      listeners.delete(listener);
    }),
    dispatchEvent: vi.fn(),
  } as MediaQueryList;

  window.matchMedia = vi.fn().mockImplementation(() => mediaQuery);

  return {
    setMatches: (nextMatches: boolean) => {
      matches = nextMatches;
      listeners.forEach((listener) => listener());
    },
  };
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const createStorageMock = (): Storage => {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: vi.fn(() => {
      store.clear();
    }),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, String(value));
    }),
  };
};

describe("useTheme", () => {
  beforeEach(() => {
    vi.spyOn(window, "localStorage", "get").mockReturnValue(createStorageMock());
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads stored dark mode and applies dark class", async () => {
    mockMatchMedia(false);
    window.localStorage.setItem("theme-mode", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mode).toBe("dark");
      expect(result.current.theme).toBe("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("tracks system preference changes when mode is system", async () => {
    const media = mockMatchMedia(true);
    window.localStorage.setItem("theme-mode", "system");

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mode).toBe("system");
      expect(result.current.theme).toBe("dark");
    });

    act(() => {
      media.setMatches(false);
    });

    await waitFor(() => {
      expect(result.current.theme).toBe("light");
    });
  });

  it("persists selected mode to localStorage", async () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    await waitFor(() => {
      expect(window.localStorage.getItem("theme-mode")).toBe("dark");
      expect(result.current.mode).toBe("dark");
      expect(result.current.theme).toBe("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("replaces the inline color scheme left by the theme init script", async () => {
    mockMatchMedia(false);
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    root.style.backgroundColor = "#0A0A0A";
    window.localStorage.setItem("theme-mode", "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("light");
    });

    await waitFor(() => {
      expect(root.classList.contains("dark")).toBe(false);
      expect(root.style.colorScheme).toBe("light");
      expect(root.style.backgroundColor).toBe("rgb(250, 250, 248)");
    });
  });
});
