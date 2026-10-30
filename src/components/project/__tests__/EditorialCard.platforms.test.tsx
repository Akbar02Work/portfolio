import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EditorialCard from "@/components/project/EditorialCard";
import { projectStylesBySlug } from "@/constants/projectStyles";
import { allProjectsSummary } from "@/data/projectsSummary";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThemeMenu } from "@/components/layout/navbar/ThemeMenu";

describe("EditorialCard platform content", () => {
  it("changes the complete Lumingo card and destination when Web is selected", () => {
    const project = allProjectsSummary.find((candidate) => candidate.slug === "lumingo");
    const style = projectStylesBySlug.lumingo;

    expect(project).toBeDefined();
    expect(style).toBeDefined();

    render(
      <MemoryRouter>
        <EditorialCard
          project={project!}
          index={0}
          style={style!}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/language-learning app for Android/i)).toBeTruthy();
    expect(screen.queryByText("RC")).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Web — Public beta" }));

    expect(screen.getByText(/web app for language learning/i)).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Web — Public beta" })).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByText("Live")).toBeNull();
    expect(screen.queryByText("Adaptive")).toBeNull();
    expect(screen.queryByText(/language-learning app for Android/i)).toBeNull();
    expect(screen.queryByText("RC")).toBeNull();

    const projectLinks = screen.getAllByRole("link");
    expect(projectLinks).toHaveLength(3);
    for (const link of projectLinks) {
      expect(link.getAttribute("href")).toBe("/projects/lumingo?platform=web");
    }
  });

  it("keeps the current themed promo alongside the author's card description", () => {
    const project = allProjectsSummary.find(({ slug }) => slug === "voicenotes")!;
    const style = projectStylesBySlug.voicenotes!;
    window.localStorage.setItem("theme-mode", "light");

    render(
      <MemoryRouter>
        <ThemeProvider>
          <ThemeMenu />
          <EditorialCard project={project} index={0} style={style} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/I independently designed and built an Android voice notes app/)).toBeTruthy();
    expect(screen.queryByText("Resume")).toBeNull();
    expect(screen.getByRole("img", { name: project.promo!.alt })).toHaveAttribute("src", project.promo!.light.poster);

    fireEvent.click(screen.getByRole("button", { name: "Select theme" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Dark" }));

    expect(screen.getByRole("img", { name: project.promo!.alt })).toHaveAttribute("src", project.promo!.dark.poster);
    expect(document.querySelector("video")).toBeNull();
    window.localStorage.removeItem("theme-mode");
  });
});
