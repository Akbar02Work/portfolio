import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock HTMLCanvasElement (Restored from original)
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: vi.fn(() => ({
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        arcTo: vi.fn(),
        closePath: vi.fn(),
        fill: vi.fn(),
        clearRect: vi.fn(),
        fillText: vi.fn(),
        font: "",
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "#000",
    })),
});

Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
    value: vi.fn(() => "data:image/png;base64,"),
});

// Mock IntersectionObserver
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

window.IntersectionObserver = vi.fn(() => ({
    observe,
    unobserve,
    disconnect,
    takeRecords: vi.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
})) as unknown as typeof IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock window.scrollTo
window.scrollTo = vi.fn();
