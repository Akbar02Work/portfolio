import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import ProjectGallery from "@/components/project/ProjectGallery";
import { projectStylesBySlug } from "@/constants/projectStyles";
import { projects } from "@/data/projects";

describe("ProjectGallery platform switching", () => {
  it("shows one Lumingo platform at a time and keeps iOS visible in development", () => {
    const project = projects.find((candidate) => candidate.slug === "lumingo");
    const style = projectStylesBySlug.lumingo;

    expect(project).toBeDefined();
    expect(style).toBeDefined();

    const ControlledGallery = () => {
      const [activePlatform, setActivePlatform] = useState<"android" | "web" | "ios">(
        "web"
      );
      return (
        <ProjectGallery
          project={project!}
          style={style!}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
        />
      );
    };

    render(<ControlledGallery />);

    expect(
      screen
        .getByRole("tab", { name: "Web — Public beta" })
        .getAttribute("aria-selected")
    ).toBe("true");
    expect(
      screen.getAllByRole("img", { name: /Web landing/i }).length
    ).toBeGreaterThan(0);
    expect(screen.queryByRole("img", { name: /Android goals/i })).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "iOS — In development" }));
    expect(screen.getByText("In development")).toBeTruthy();
    expect(screen.getAllByRole("img", { name: /iOS client/i })).toHaveLength(1);
  });
});
