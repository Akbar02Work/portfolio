import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/hooks/useTheme";
import Easter from "@/pages/Easter";

const renderEaster = (options: {
  reportMarkdownOverride: string;
  buildVersionOverride: string;
}) =>
  render(
    <ThemeProvider>
      <HelmetProvider>
        <MemoryRouter>
          <Easter
            reportMarkdownOverride={options.reportMarkdownOverride}
            buildVersionOverride={options.buildVersionOverride}
          />
        </MemoryRouter>
      </HelmetProvider>
    </ThemeProvider>
  );

describe("Easter page", () => {
  it("renders the latest version parsed from the changelog", () => {
    renderEaster({
      reportMarkdownOverride:
        "# Changelog\n\n## [9.9.9] — 2026-07-24\n\nRelease notes body",
      buildVersionOverride: "v0.0.0+test-sha",
    });

    expect(screen.getByRole("heading", { level: 1, name: "v9.9.9" })).toBeTruthy();
    expect(screen.getByText(/Release notes body/i)).toBeTruthy();
  });

  it("falls back to build version when the changelog has no release heading", () => {
    renderEaster({
      reportMarkdownOverride: "No version header here\n\nSome details",
      buildVersionOverride: "v1.2.3+fallback",
    });

    expect(screen.getByRole("heading", { level: 1, name: "v1.2.3+fallback" })).toBeTruthy();
    expect(screen.getByText(/No version header here/i)).toBeTruthy();
  });
});
