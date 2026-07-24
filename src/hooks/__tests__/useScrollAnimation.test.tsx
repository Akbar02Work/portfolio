import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const setMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

const Probe = ({ triggerOnce = true }: { triggerOnce?: boolean }) => {
  const { ref, isVisible, reduceMotion, skipTransition } = useScrollAnimation({ triggerOnce });

  return (
    <div
      ref={ref}
      data-testid="probe"
      data-visible={String(isVisible)}
      data-reduce-motion={String(reduceMotion)}
      data-skip-transition={String(skipTransition)}
    />
  );
};

type IntersectionObserverDriver = {
  trigger: (isIntersecting: boolean, top?: number) => void;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

const installIntersectionObserverMock = (): IntersectionObserverDriver => {
  let callback: IntersectionObserverCallback | null = null;
  let observedElement: Element | null = null;
  const observe = vi.fn((element: Element) => {
    observedElement = element;
  });
  const disconnect = vi.fn();

  const ObserverMock = vi.fn((cb: IntersectionObserverCallback) => {
    callback = cb;
    return {
      observe,
      disconnect,
      unobserve: vi.fn(),
      takeRecords: vi.fn(() => []),
      root: null,
      rootMargin: "0px",
      thresholds: [0],
    } as unknown as IntersectionObserver;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = ObserverMock;

  return {
    observe,
    disconnect,
    trigger: (isIntersecting: boolean, top = 0) => {
      if (!callback || !observedElement) {
        throw new Error("IntersectionObserver callback is not initialized");
      }

      const entry = {
        isIntersecting,
        target: observedElement,
        boundingClientRect: { top },
      } as IntersectionObserverEntry;

      callback([entry], {} as IntersectionObserver);
    },
  };
};

describe("useScrollAnimation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("enables content immediately when reduced motion is preferred", async () => {
    setMatchMedia(true);
    const ioCtor = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = ioCtor;
    render(<Probe />);

    await waitFor(() => {
      const probe = screen.getByTestId("probe");
      expect(probe.getAttribute("data-reduce-motion")).toBe("true");
      expect(probe.getAttribute("data-visible")).toBe("true");
    });
    expect(ioCtor).not.toHaveBeenCalled();
  });

  it("toggles visibility on intersection changes when triggerOnce is false", async () => {
    setMatchMedia(false);
    const observer = installIntersectionObserverMock();
    render(<Probe triggerOnce={false} />);

    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("probe").getAttribute("data-visible")).toBe("false");

    act(() => {
      observer.trigger(true);
    });

    await waitFor(() => {
      expect(screen.getByTestId("probe").getAttribute("data-visible")).toBe("true");
    });

    act(() => {
      observer.trigger(false);
    });

    await waitFor(() => {
      expect(screen.getByTestId("probe").getAttribute("data-visible")).toBe("false");
    });
    expect(observer.disconnect).not.toHaveBeenCalled();
  });

  it("reveals content that a rapid scroll passes without an observer threshold crossing", async () => {
    setMatchMedia(false);
    installIntersectionObserverMock();
    render(<Probe />);

    const probe = screen.getByTestId("probe");
    vi.spyOn(probe, "getBoundingClientRect").mockReturnValue({
      top: -100,
    } as DOMRect);

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(probe.getAttribute("data-visible")).toBe("true");
      expect(probe.getAttribute("data-skip-transition")).toBe("true");
    });
  });
});
