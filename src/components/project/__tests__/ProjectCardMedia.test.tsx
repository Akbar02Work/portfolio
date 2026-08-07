import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProjectCardMedia from "@/components/project/ProjectCardMedia";
import { projectStylesBySlug } from "@/constants/projectStyles";
import { projectsSummary } from "@/data/projectsSummary";

describe("ProjectCardMedia", () => {
  it("keeps Android first and lets the visitor inspect Web and iOS", () => {
    const project = projectsSummary.find((candidate) => candidate.slug === "lumingo");
    const style = projectStylesBySlug.lumingo;

    expect(project).toBeDefined();
    expect(style).toBeDefined();
    const onPlatformChange = vi.fn();

    render(
      <MemoryRouter>
        <ProjectCardMedia
          project={project!}
          style={style!}
          href="/projects/lumingo"
          activePlatform="web"
          onPlatformChange={onPlatformChange}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: /Web landing/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "iOS — In development" }));
    expect(onPlatformChange).toHaveBeenCalledWith("ios");
    expect(screen.getByText("Public beta")).toBeTruthy();
  });
});
