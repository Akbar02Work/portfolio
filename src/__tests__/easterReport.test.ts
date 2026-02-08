import { describe, it, expect } from "vitest";
import { parseEasterReport } from "../lib/easterReport";

describe("parseEasterReport", () => {
  const fallback = "0.0.0";

  it("extracts version from first line when present", () => {
    const input = "version: 1.2.3\nHello world\nMore content";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("1.2.3");
    expect(result.reportBody).toBe("Hello world\nMore content");
  });

  it("handles case-insensitive version prefix", () => {
    const input = "VERSION: 2.0.0\nBody text";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("2.0.0");
  });

  it("handles version with extra spaces", () => {
    const input = "version :   3.0.0  \nBody";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("3.0.0");
  });

  it("returns fallback version when no version line", () => {
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

  it("handles Windows-style line endings (CRLF)", () => {
    const input = "version: 1.0.0\r\n\r\nBody content";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("1.0.0");
    expect(result.reportBody).toBe("Body content");
  });

  it("strips leading newlines from body", () => {
    const input = "version: 1.0.0\n\n\n\nActual body";
    const result = parseEasterReport(input, fallback);

    expect(result.reportBody).toBe("Actual body");
  });

  it("handles version-only input (no body)", () => {
    const input = "version: 1.0.0";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe("1.0.0");
    expect(result.reportBody).toBe("");
  });

  it("returns fallback when version value is only whitespace", () => {
    const input = "version:   \nBody";
    const result = parseEasterReport(input, fallback);

    expect(result.manualVersion).toBe(fallback);
  });
});
