import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useI18n } from "@/i18n/useI18n";
import { messages } from "@/i18n/messages";
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

const setup = (initialPath = "/") => render(
  <MemoryRouter initialEntries={[initialPath]}>
    <I18nProvider>
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/ru" element={<Content />} />
      </Routes>
    </I18nProvider>
  </MemoryRouter>,
);

const snippetText = (element: Element) => {
  const copy = element.cloneNode(true) as Element;
  copy.querySelectorAll("[data-nosnippet]").forEach((excluded) => excluded.remove());
  return copy.textContent;
};

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

  it.each(["/", "/ru"])("preserves sizing layers and limits snippet text to the active locale from %s", (initialPath) => {
    setup(initialPath);
    const initial = messages[initialPath === "/" ? "en" : "ru"];
    const next = messages[initialPath === "/" ? "ru" : "en"];
    const heading = screen.getByRole("heading", { name: initial.projects.title });
    const sizingLayers = [...heading.querySelectorAll("[lang]")];
    expect(sizingLayers).toHaveLength(2);
    expect(snippetText(heading)).toBe(initial.projects.title);
    expect(screen.queryByRole("heading", { name: next.projects.title })).toBeNull();
    expect(frames.size).toBe(0); // No scramble on the initial page load.

    // Google advises against changing snippet eligibility on existing DOM nodes.
    const observer = new MutationObserver(() => {});
    observer.observe(heading, { attributes: true, subtree: true, attributeFilter: ["data-nosnippet"] });
    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    expect(observer.takeRecords()).toHaveLength(0);
    observer.disconnect();

    expect(screen.getByRole("heading", { name: next.projects.title })).toBe(heading);
    expect([...heading.querySelectorAll("[lang]")]).toEqual(sizingLayers);
    expect(snippetText(heading)).toBe(next.projects.title);
    expect(screen.queryByRole("heading", { name: initial.projects.title })).toBeNull();
    expect(screen.getByRole("button", { name: next.hero.contact })).toBeInTheDocument();
  });

  it("keeps scramble out of accessible names and settles to the latest rapid switch", () => {
    const { container } = setup();
    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    advanceFrame(64);
    const visual = container.querySelector(".locale-text__scramble");
    expect(visual).toHaveAttribute("aria-hidden", "true");
    expect(visual).toHaveAttribute("data-nosnippet");
    expect(visual?.textContent).not.toBe("01 / Проекты");
    expect(snippetText(screen.getByRole("heading", { name: "01 / Проекты" }))).toBe("01 / Проекты");

    fireEvent.click(screen.getByRole("link", { name: "Switch" }));
    advanceFrame(350);
    expect(visual?.textContent).toBe("01 / Projects");
    expect(snippetText(screen.getByRole("heading", { name: "01 / Projects" }))).toBe("01 / Projects");
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
