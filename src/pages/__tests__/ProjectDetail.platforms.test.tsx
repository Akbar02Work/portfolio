import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProjectDetail from "@/pages/ProjectDetail";
import { ThemeProvider } from "@/hooks/useTheme";

const renderProjectDetail = (entry: string) => {
  render(
    <ThemeProvider>
      <HelmetProvider>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
};

describe("ProjectDetail platform routing", () => {
  it("does not expose the hidden Lumingo case through a direct URL", () => {
    renderProjectDetail("/projects/lumingo?platform=web");

    expect(screen.getByRole("heading", { level: 1, name: /404/i })).toBeTruthy();
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.queryByText("TypeScript")).toBeNull();
  });
});
