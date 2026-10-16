import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSlidingIndicator } from "@/hooks/useSlidingIndicator";

const values = ["a", "b", "c"];
const Probe = ({ value }: { value: string }) => {
  const { rootRef, indicatorRef } = useSlidingIndicator(value);
  return (
    <div ref={rootRef} data-testid="root">
      <span ref={indicatorRef} data-testid="indicator" />
      {values.map((item) => (
        <button key={item} data-indicator-value={item}>
          {item}<span data-indicator-label="" aria-hidden="true">{item}</span>
        </button>
      ))}
    </div>
  );
};

const rect = (left: number, width: number, top = 15, height = 32): DOMRect =>
  ({ left, right: left + width, top, bottom: top + height, width, height, x: left, y: top, toJSON: () => ({}) });

describe("useSlidingIndicator", () => {
  let widths: number[];
  let origin: number;
  let renderedPill: DOMRect | null;
  let now: number;
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;

  beforeEach(() => {
    vi.mocked(window.ResizeObserver).mockImplementation(() => ({
      observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn(),
    }));
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    widths = [80, 60, 100];
    origin = 200;
    renderedPill = null;
    now = 0;
    nextFrame = 0;
    frames = new Map();
    vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
    vi.spyOn(HTMLElement.prototype, "clientLeft", "get").mockReturnValue(1);
    vi.spyOn(HTMLElement.prototype, "clientTop", "get").mockReturnValue(1);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      if (this.dataset.testid === "root") return rect(origin, 250, 10, 42);
      if (this.dataset.testid === "indicator") {
        if (renderedPill) return renderedPill;
        const x = Number.parseFloat(this.style.transform.slice("translate3d(".length)) || 0;
        return rect(origin + 1 + x, Number.parseFloat(this.style.width) || 0);
      }
      const value = this.dataset.indicatorValue ?? this.parentElement?.dataset.indicatorValue;
      const index = values.indexOf(value ?? "");
      return rect(origin + 5 + widths.slice(0, index).reduce((sum, width) => sum + width, 0), widths[index] ?? 0);
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const advanceFrame = (elapsed: number) => {
    now += elapsed;
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => callbacks.forEach((callback) => callback(now)));
  };

  const masks = () => Array.from(document.querySelectorAll<HTMLElement>("[data-indicator-label]"))
    .map((label) => label.style.clipPath);

  it("colors text under the moving pill, including intermediate tabs and interrupted transitions", () => {
    const view = render(<Probe value="a" />);
    const pill = screen.getByTestId("indicator");
    expect(pill.style.transform).toBe("translate3d(4px, 0, 0)");
    expect(masks()).toEqual(["inset(0 0px 0 0px)", "inset(0 100% 0 0)", "inset(0 100% 0 0)"]);
    expect(frames.size).toBe(0);

    renderedPill = rect(245, 80);
    view.rerender(<Probe value="c" />);
    expect(pill.style.transform).toBe("translate3d(144px, 0, 0)");
    expect(masks()).toEqual(["inset(0 0px 0 40px)", "inset(0 20px 0 0px)", "inset(0 100% 0 0)"]);

    renderedPill = rect(305, 90);
    advanceFrame(16);
    expect(masks()).toEqual(["inset(0 100% 0 0)", "inset(0 0px 0 20px)", "inset(0 50px 0 0px)"]);
    view.rerender(<Probe value="a" />);
    expect(pill.style.transform).toBe("translate3d(4px, 0, 0)");
    expect(frames.size).toBe(1);

    renderedPill = null;
    advanceFrame(320);
    expect(masks()).toEqual(["inset(0 0px 0 0px)", "inset(0 100% 0 0)", "inset(0 100% 0 0)"]);
    expect(frames.size).toBe(0);

    renderedPill = rect(245, 80);
    view.rerender(<Probe value="c" />);
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
  });

  it("re-measures variable widths without replaying page offsets and respects reduced motion", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const view = render(<Probe value="a" />);
    view.rerender(<Probe value="c" />);
    const pill = screen.getByTestId("indicator");
    expect(pill.style.transition).toBe("none");

    origin = 400;
    widths = [100, 90, 120];
    act(() => { window.dispatchEvent(new Event("resize")); });
    expect(pill.style.transform).toBe("translate3d(194px, 0, 0)");
    expect(pill.style.width).toBe("120px");
    expect(masks()).toEqual(["inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 0px 0 0px)"]);
    expect(frames.size).toBe(0);
  });
});
