import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import { LanguageSwitch } from "../LanguageSwitch";

class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

const Location = () => {
  const { pathname, search, hash } = useLocation();
  return <output data-testid="location">{pathname}{search}{hash}</output>;
};

const setup = () => {
  const onSwitch = vi.fn();
  render(
    <MemoryRouter initialEntries={["/projects/lumingo?platform=web#details"]}>
      <I18nProvider>
        <LanguageSwitch onSwitch={onSwitch} />
        <Location />
      </I18nProvider>
    </MemoryRouter>,
  );
  const root = screen.getByRole("group");
  root.setPointerCapture = vi.fn();
  return { root, onSwitch };
};

describe("LanguageSwitch", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("PointerEvent", TestPointerEvent);
    vi.mocked(window.ResizeObserver).mockImplementation(() => ({
      observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn(),
    }));
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("preserves the path, query and hash for both clicks and dragging", () => {
    const { root, onSwitch } = setup();
    const ru = screen.getByRole("link", { name: "Русский" });
    expect(ru).toHaveAttribute("href", "/ru/projects/lumingo?platform=web#details");
    fireEvent.click(ru);
    expect(screen.getByTestId("location")).toHaveTextContent("/ru/projects/lumingo?platform=web#details");

    fireEvent.pointerDown(root, { button: 0, clientX: 60, pointerId: 1 });
    // Batched pointer events must commit the latest position, not stale React state.
    act(() => {
      fireEvent.pointerMove(root, { clientX: 22, pointerId: 1 });
      fireEvent.pointerUp(root, { clientX: 22, pointerId: 1 });
    });
    expect(screen.getByTestId("location")).toHaveTextContent("/projects/lumingo?platform=web#details");
    expect(window.localStorage.getItem("locale")).toBe("en");
    expect(onSwitch).toHaveBeenCalledTimes(2);
    expect(root.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it("cancels a drag without changing language or swallowing the next real click", () => {
    const { root, onSwitch } = setup();
    fireEvent.pointerDown(root, { button: 0, clientX: 0 });
    fireEvent.pointerMove(root, { clientX: 38 });
    fireEvent.pointerCancel(root);
    expect(onSwitch).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Русский" })).toBeInTheDocument();

    const ru = screen.getByRole("link", { name: "Русский" });
    fireEvent.pointerDown(ru, { button: 0, clientX: 38 });
    fireEvent.pointerUp(ru, { clientX: 38 });
    fireEvent.click(ru);
    expect(onSwitch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "English" })).toBeInTheDocument();
  });

  it("grabs an interrupted glide at its visible position", () => {
    const { root, onSwitch } = setup();
    const first = root.querySelector<HTMLElement>("[data-indicator-value]")!;
    const pill = root.firstElementChild!;
    vi.spyOn(first, "getBoundingClientRect").mockReturnValue({ left: 0 } as DOMRect);
    vi.spyOn(pill, "getBoundingClientRect").mockReturnValue({ left: 19, width: 36 } as DOMRect);

    fireEvent.pointerDown(root, { button: 0, clientX: 100 });
    fireEvent.pointerMove(root, { clientX: 105 });
    fireEvent.pointerUp(root, { clientX: 105 });
    expect(onSwitch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "English" })).toBeInTheDocument();
  });

  it("keeps keyboard focus on the selected segment and ignores an already active choice", () => {
    const { onSwitch } = setup();
    fireEvent.click(screen.getByRole("link", { name: "English" }));
    expect(onSwitch).not.toHaveBeenCalled();

    const russian = screen.getByRole("link", { name: "Русский" });
    russian.focus();
    fireEvent.click(russian);
    expect(screen.getByRole("link", { name: "Русский" })).toBe(russian);
    expect(russian).toHaveFocus();
    expect(russian).toHaveAttribute("aria-current", "true");
    expect(onSwitch).toHaveBeenCalledTimes(1);
  });
});
