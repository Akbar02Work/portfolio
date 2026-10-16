import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useI18n } from "@/i18n/useI18n";
import { LocalizedText } from "../LocalizedText";

const Content = () => {
  const { locale } = useI18n();
  return <>
    <h1><LocalizedText>{copy => copy.projects.title}</LocalizedText></h1>
    <h2><LocalizedText scramble>{copy => copy.projects.eyebrow}</LocalizedText></h2>
    <button><LocalizedText>{copy => copy.hero.contact}</LocalizedText></button>
    <Link to={locale === "en" ? "/ru" : "/"}>Switch</Link>
  </>;
};

const setup = () => render(
  <MemoryRouter>
    <I18nProvider>
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/ru" element={<Content />} />
      </Routes>
    </I18nProvider>
  </MemoryRouter>,
);

describe("LocalizedText", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;

  const advanceFrame = (time: number) => act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(time));
  });

  beforeEach(() => {
    window.localStorage.clear();
    frames.clear();
    nextFrame = 0;
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("preserves sizing layers across locale routes and exposes only the active copy", () => {
    setup();
    const heading = screen.getByRole("heading", { name: "Selected Projects" });
    const sizingLayers = [...heading.querySelectorAll("[lang]")];
    expect(sizingLayers).toHaveLength(2);
    expect(screen.queryByRole("heading", { name: "Избранные проекты" })).toBeNull();
    expect(frames.size).toBe(0); // No scramble on the initial page load.

    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    expect(screen.getByRole("heading", { name: "Избранные проекты" })).toBe(heading);
    expect([...heading.querySelectorAll("[lang]")]).toEqual(sizingLayers);
    expect(screen.queryByRole("heading", { name: "Selected Projects" })).toBeNull();
    expect(screen.getByRole("button", { name: "Связаться" })).toBeInTheDocument();
  });

  it("keeps scramble out of accessible names and settles to the latest rapid switch", () => {
    const { container } = setup();
    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    advanceFrame(64);
    const visual = container.querySelector(".locale-text__scramble");
    expect(visual).toHaveAttribute("aria-hidden", "true");
    expect(visual?.textContent).not.toBe("01 / Проекты");
    expect(screen.getByRole("heading", { name: "01 / Проекты" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    advanceFrame(350);
    expect(visual?.textContent).toBe("01 / Projects");
    expect(frames.size).toBe(0);
  });

  it("applies the final copy immediately with reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { container } = setup();
    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    expect(container.querySelector(".locale-text__scramble")?.textContent).toBe("01 / Проекты");
    expect(frames.size).toBe(0);
  });

  it("cancels pending animation work on unmount", () => {
    const { unmount } = setup();
    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
  });
});
