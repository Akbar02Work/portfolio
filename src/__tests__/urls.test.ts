import { describe, it, expect, vi } from "vitest";
import { withBase } from "../lib/urls";
import { buildProjectUrl } from "@/constants/routes";
import { getCreativeUrl } from "@/constants/siteVersions";

describe("Creative entry", () => {
    it("requests the intro when entering through the hidden version chooser", () => {
        expect(new URL(getCreativeUrl()).searchParams.get("intro")).toBe("1");
    });

    it("preserves an overridden destination's query and section", () => {
        vi.stubEnv("VITE_CREATIVE_URL", "https://creative.example/lab?view=demo#works");
        try {
            expect(getCreativeUrl()).toBe("https://creative.example/lab/?view=demo&intro=1#works");
        } finally {
            vi.unstubAllEnvs();
        }
    });
});

describe("buildProjectUrl", () => {
    it("adds a selected platform without changing single-surface project URLs", () => {
        expect(buildProjectUrl("lumingo", "web")).toBe(
            "/projects/lumingo?platform=web"
        );
        expect(buildProjectUrl("voicenotes")).toBe("/projects/voicenotes");
    });
});

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
