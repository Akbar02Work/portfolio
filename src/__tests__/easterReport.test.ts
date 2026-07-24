import { describe, it, expect } from "vitest";
import { parseEasterReport } from "../lib/easterReport";

describe("parseEasterReport", () => {
  const fallback = "v0.0.0+test";

  it("extracts the latest semantic release heading", () => {
    const input = "# Changelog\n\nIntro\n\n## [2.0.0] — 2026-07-24\n\nRelease notes";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("v2.0.0");
    expect(result.reportBody).toBe(input);
  });

  it("accepts an unbracketed version heading", () => {
    const input = "# Changelog\n\n## 3.1.0 - 2026-07-24\n\nBody text";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("v3.1.0");
  });

  it("uses the first release heading when history contains multiple versions", () => {
    const input = "## [2.0.0] — 2026-07-24\n\n## [1.0.0] — 2026-02-07";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("v2.0.0");
  });

  it("returns the build version when no release heading exists", () => {
    const input = "No version here\nJust content";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe(fallback);
    expect(result.reportBody).toBe(input);
  });

  it("returns fallback for empty string", () => {
    const result = parseEasterReport("", fallback);

    expect(result.manualVersion).toBe(fallback);
    expect(result.reportBody).toBe("");
  });

  it("normalizes Windows-style line endings", () => {
    const input = "# Changelog\r\n\r\n## [1.0.0] — 2026-02-07\r\n\r\nBody";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("v1.0.0");
    expect(result.reportBody).toBe(
      "# Changelog\n\n## [1.0.0] — 2026-02-07\n\nBody"
    );
  });
});
