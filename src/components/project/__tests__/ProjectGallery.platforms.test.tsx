import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProjectGallery from "@/components/project/ProjectGallery";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { projectStylesBySlug } from "@/constants/projectStyles";
import { allProjects, resolveProjectPlatform } from "@/data/projects";

describe("ProjectGallery platform switching", () => {
  it("shows one Lumingo platform at a time and keeps iOS visible in development", () => {
    const project = allProjects.find((candidate) => candidate.slug === "lumingo");
    const style = projectStylesBySlug.lumingo;

    expect(project).toBeDefined();
    expect(style).toBeDefined();

    const ControlledGallery = () => {
      const [activePlatform, setActivePlatform] = useState<"android" | "web" | "ios">(
        "web"
      );
      return (
        <>
          <ProjectHeader
            project={resolveProjectPlatform(project!, activePlatform)}
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
          />
          <ProjectGallery
            project={project!}
            style={style!}
            activePlatform={activePlatform}
          />
        </>
      );
    };

    render(<MemoryRouter><ControlledGallery /></MemoryRouter>);

    expect(
      screen
        .getByRole("tab", { name: "Web — Public beta" })
        .getAttribute("aria-selected")
    ).toBe("true");
    expect(
      screen.getAllByRole("img", { name: /Web — the public-beta landing/i }).length
    ).toBeGreaterThan(0);
    expect(screen.queryByRole("img", { name: /Android — active goals/i })).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "iOS — In development" }));
    expect(screen.getByRole("tab", { name: "iOS — In development", selected: true })).toBeTruthy();
    expect(screen.getAllByRole("img", { name: /iOS — native client/i })).toHaveLength(1);
  });
});
