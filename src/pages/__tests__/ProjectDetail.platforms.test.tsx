import { fireEvent, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProjectDetail from "@/pages/ProjectDetail";
import { ThemeProvider } from "@/hooks/useTheme";

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
};

const renderProjectDetail = (entry: string) => {
  render(
    <ThemeProvider>
      <HelmetProvider>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
          <LocationProbe />
        </MemoryRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
};

describe("ProjectDetail platform routing", () => {
  it("opens the complete Web case from the query and keeps Lumingo private", () => {
    renderProjectDetail("/projects/lumingo?platform=web");

    expect(
      screen
        .getByRole("tab", { name: "Web — Public beta" })
        .getAttribute("aria-selected")
    ).toBe("true");
    expect(screen.getByText(/live web product/i)).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
    expect(screen.getByText(/coordinating identity, adaptive product state/i)).toBeTruthy();
    expect(screen.getAllByRole("img", { name: /Web landing/i }).length).toBeGreaterThan(0);
    const detailHeader = document.querySelector<HTMLElement>(
      "[data-project-detail] > header"
    );
    expect(detailHeader).not.toBeNull();
    expect(within(detailHeader!).queryByRole("link", { name: "GitHub" })).toBeNull();
  });

  it("updates the URL and every case-study section when iOS is selected", () => {
    renderProjectDetail("/projects/lumingo?platform=android");

    fireEvent.click(screen.getByRole("tab", { name: "iOS — In development" }));

    expect(screen.getByTestId("location-search").textContent).toBe("?platform=ios");
    expect(screen.getByText(/iOS is in development/i)).toBeTruthy();
    expect(screen.getByText("Swift · Planned")).toBeTruthy();
    expect(screen.getByText(/iOS challenge is still ahead/i)).toBeTruthy();
    expect(screen.getByText(/iOS is planned, not released/i)).toBeTruthy();
    expect(screen.queryByText("Kotlin")).toBeNull();
  });

  it("falls back to Android for an invalid platform query", () => {
    renderProjectDetail("/projects/lumingo?platform=wrong");

    expect(
      screen
        .getByRole("tab", { name: "Android — Release candidate" })
        .getAttribute("aria-selected")
    ).toBe("true");
    expect(
      screen.getByText(/^A native Android client that brings Lumingo/i)
    ).toBeTruthy();
    expect(screen.getByText("Kotlin")).toBeTruthy();
  });
});
