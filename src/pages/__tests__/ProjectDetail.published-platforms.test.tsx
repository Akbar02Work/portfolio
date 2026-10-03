import { fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProjectDetail from "@/pages/ProjectDetail";
import { ThemeProvider } from "@/hooks/useTheme";
import { allProjects, resolveProjectPlatform } from "@/data/projects";

// Exercise the prepared case in isolation; the real publication flag stays false.
vi.mock("@/data/projects", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/data/projects")>();
  return { ...original, projects: original.allProjects, projectsByLocale: original.allProjectsByLocale };
});

const HistoryControls = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return <>
    <button onClick={() => navigate(-1)}>History back</button>
    <button onClick={() => navigate(1)}>History forward</button>
    <output data-testid="query">{location.search}</output>
  </>;
};

const mount = (query: string) => render(
  <ThemeProvider><HelmetProvider>
    <MemoryRouter initialEntries={[`/projects/lumingo${query}`]}>
      <HistoryControls />
      <Routes><Route path="/projects/:slug" element={<ProjectDetail />} /></Routes>
    </MemoryRouter>
  </HelmetProvider></ThemeProvider>
);

describe("published platform routing", () => {
  it.each([
    ["?platform=web", "web"], ["?platform=ios", "ios"],
    ["?platform=invalid", "android"], ["", "android"],
  ])("resolves %s consistently across case sections", (query, id) => {
    mount(query);
    const project = allProjects.find((entry) => entry.slug === "lumingo")!;
    const view = resolveProjectPlatform(project, id);
    expect(screen.getByText(view.summary)).toBeTruthy();
    expect(screen.getByText(view.challenge)).toBeTruthy();
    expect(screen.getByText(view.engineeringNote)).toBeTruthy();
    for (const tech of view.technologies) expect(screen.getByText(tech)).toBeTruthy();
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toContain(
      project.platforms.find((entry) => entry.id === id)!.label
    );
  });

  it("restores platform selection through browser history and keyboard navigation", () => {
    mount("?platform=android&ref=portfolio");
    fireEvent.click(screen.getByRole("tab", { name: /Web/ }));
    expect(screen.getByTestId("query").textContent).toBe("?platform=web&ref=portfolio");
    fireEvent.click(screen.getByRole("button", { name: "History back" }));
    expect(screen.getByRole("tab", { selected: true }).textContent).toBe("Android");
    fireEvent.click(screen.getByRole("button", { name: "History forward" }));
    expect(screen.getByRole("tab", { selected: true }).textContent).toBe("Web");
    fireEvent.keyDown(screen.getByRole("tab", { selected: true }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { selected: true }).textContent).toBe("iOS");
    expect(screen.queryByRole("button", { name: "Next screen" })).toBeNull();
    expect(screen.getAllByRole("img", { name: /iOS — native client/ })).toHaveLength(1);
  });
});
