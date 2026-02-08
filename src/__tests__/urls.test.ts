import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withBase, toAbsoluteUrl } from "../lib/urls";

describe("withBase", () => {
    it("returns absolute URLs unchanged", () => {
        expect(withBase("https://example.com/path")).toBe("https://example.com/path");
        expect(withBase("http://example.com")).toBe("http://example.com");
        expect(withBase("//cdn.example.com/file.js")).toBe("//cdn.example.com/file.js");
    });

    it("returns data URLs unchanged", () => {
        expect(withBase("data:image/png;base64,abc123")).toBe("data:image/png;base64,abc123");
    });

    it("prepends BASE_URL to relative paths", () => {
        // BASE_URL defaults to "/" in test environment
        expect(withBase("images/photo.jpg")).toBe("/images/photo.jpg");
        expect(withBase("file.txt")).toBe("/file.txt");
    });

    it("removes leading slash from relative paths before prepending", () => {
        expect(withBase("/assets/logo.png")).toBe("/assets/logo.png");
    });
});

describe("toAbsoluteUrl", () => {
    const originalLocation = window.location;

    beforeEach(() => {
        // Mock window.location.origin
        Object.defineProperty(window, "location", {
            value: { origin: "https://mysite.com" },
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, "location", {
            value: originalLocation,
            writable: true,
        });
    });

    it("converts relative path to full URL", () => {
        expect(toAbsoluteUrl("images/photo.jpg")).toBe("https://mysite.com/images/photo.jpg");
    });

    it("converts path with leading slash to full URL", () => {
        expect(toAbsoluteUrl("/assets/logo.png")).toBe("https://mysite.com/assets/logo.png");
    });

    it("returns absolute URLs unchanged", () => {
        expect(toAbsoluteUrl("https://other.com/file.js")).toBe("https://other.com/file.js");
    });
});
