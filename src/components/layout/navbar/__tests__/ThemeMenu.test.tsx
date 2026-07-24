import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThemeMenu } from "../ThemeMenu";

const createStorageMock = (): Storage => {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: vi.fn(() => store.clear()),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => store.delete(key)),
    setItem: vi.fn((key: string, value: string) => store.set(key, String(value))),
  };
};

describe("ThemeMenu", () => {
  beforeEach(() => {
    vi.spyOn(window, "localStorage", "get").mockReturnValue(createStorageMock());
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes menu state and switches theme accessibly", async () => {
    render(
      <ThemeProvider>
        <ThemeMenu />
      </ThemeProvider>
    );

    const trigger = screen.getByRole("button", { name: "Select theme" });
    const menuId = trigger.getAttribute("aria-controls");
    expect(menuId).toBeTruthy();
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const menu = screen.getByRole("menu");
    expect(menu.id).toBe(menuId);
    expect(menu.getAttribute("aria-hidden")).toBe("false");

    fireEvent.click(within(menu).getByRole("menuitem", { name: "Dark" }));

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(window.localStorage.getItem("theme-mode")).toBe("dark");
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens on hover", () => {
    render(
      <ThemeProvider>
        <ThemeMenu />
      </ThemeProvider>
    );

    const trigger = screen.getByRole("button", { name: "Select theme" });
    const shell = trigger.parentElement;
    expect(shell).toBeTruthy();

    fireEvent.mouseEnter(shell!);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.mouseLeave(shell!);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
