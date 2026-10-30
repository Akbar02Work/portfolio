import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSafariViewportClip } from "../useSafariViewportClip";

const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 Version/27.2 Mobile/15E148 Safari/604.1";

describe("iPhone Safari viewport clipping", () => {
  let root: HTMLDivElement;
  let rootTop: number;
  let viewport: EventTarget & { offsetTop: number; scale: number };
  let runFrame: FrameRequestCallback | undefined;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "root";
    document.body.append(root);
    rootTop = 0;
    vi.spyOn(root, "getBoundingClientRect").mockImplementation(() => ({ top: rootTop }) as DOMRect);
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(iphone);
    viewport = Object.assign(new EventTarget(), { offsetTop: 0, scale: 1 });
    vi.stubGlobal("visualViewport", viewport);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      runFrame = callback;
      return 42;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    root.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("clips at the visible top while scrolling and when the visual viewport moves", () => {
    rootTop = -180;
    const { unmount } = renderHook(useSafariViewportClip);
    expect(root.style.clipPath).toBe("inset(180px 0 0)");

    rootTop = -320;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
    });
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    act(() => runFrame?.(0));
    expect(root.style.clipPath).toBe("inset(320px 0 0)");

    viewport.offsetTop = 25;
    act(() => viewport.dispatchEvent(new Event("scroll")));
    act(() => runFrame?.(0));
    expect(root.style.clipPath).toBe("inset(345px 0 0)");

    rootTop = 30; // Rubber-band scrolling past the start of the document.
    viewport.offsetTop = 0;
    act(() => window.dispatchEvent(new Event("scroll")));
    act(() => runFrame?.(0));
    expect(root.style.clipPath).toBe("inset(0px 0 0)");
    unmount();
  });

  it("removes the clip immediately during zoom and restores it at normal scale", () => {
    rootTop = -250;
    const { unmount } = renderHook(useSafariViewportClip);
    expect(root.style.clipPath).toBe("inset(250px 0 0)");
    act(() => window.dispatchEvent(new Event("scroll")));
    viewport.scale = 1.8;
    viewport.offsetTop = 150;
    act(() => viewport.dispatchEvent(new Event("resize")));
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(root.style.clipPath).toBe("");

    rootTop = -600;
    viewport.offsetTop = 300;
    act(() => viewport.dispatchEvent(new Event("scroll")));
    expect(root.style.clipPath).toBe("");

    viewport.scale = 1;
    viewport.offsetTop = 0;
    act(() => viewport.dispatchEvent(new Event("resize")));
    act(() => runFrame?.(0));
    expect(root.style.clipPath).toBe("inset(600px 0 0)");
    unmount();
  });

  it("restores the previous clip and cancels pending work on unmount", () => {
    root.style.clipPath = "inset(2px)";
    const { unmount } = renderHook(useSafariViewportClip);
    act(() => window.dispatchEvent(new Event("scroll")));
    unmount();
    expect(root.style.clipPath).toBe("inset(2px)");
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(42);
    act(() => window.dispatchEvent(new Event("scroll")));
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it("leaves other browsers untouched", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140");
    const { unmount } = renderHook(useSafariViewportClip);
    act(() => window.dispatchEvent(new Event("scroll")));
    expect(root.style.clipPath).toBe("");
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    unmount();
  });
});
