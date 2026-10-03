import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EditorialCard from "@/components/project/EditorialCard";
import { projectStylesBySlug } from "@/constants/projectStyles";
import { allProjectsSummary } from "@/data/projectsSummary";

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
    expect(screen.getByText("RC")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Web — Public beta" }));

    expect(screen.getByText(/web app for language learning/i)).toBeTruthy();
    expect(screen.getByText("Live")).toBeTruthy();
    expect(screen.getByText("Adaptive")).toBeTruthy();
    expect(screen.queryByText(/language-learning app for Android/i)).toBeNull();
    expect(screen.queryByText("RC")).toBeNull();

    const projectLinks = screen.getAllByRole("link");
    expect(projectLinks).toHaveLength(3);
    for (const link of projectLinks) {
      expect(link.getAttribute("href")).toBe("/projects/lumingo?platform=web");
    }
  });
});
