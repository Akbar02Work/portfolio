import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProjectPlatformTabs } from "@/components/project/ProjectPlatformTabs";
import type { ProjectPlatform, ProjectPlatformId } from "@/data/projectCatalog";

const platforms: ProjectPlatform[] = [
  {
    id: "android",
    label: "Android",
    status: "Release candidate",
    mediaType: "phone",
  },
  {
    id: "web",
    label: "Web",
    status: "Public beta",
    mediaType: "browser",
  },
  {
    id: "ios",
    label: "iOS",
    status: "In development",
    mediaType: "phone",
  },
];

describe("ProjectPlatformTabs", () => {
  it("exposes platform status and selects a different product surface", () => {
    const onSelect = vi.fn();

    render(
      <ProjectPlatformTabs
        platforms={platforms}
        activePlatform="android"
        onSelect={onSelect}
        label="Choose Lumingo platform"
      />
    );

    expect(
      screen
        .getByRole("tab", { name: "Android — Release candidate" })
        .getAttribute("aria-selected")
    ).toBe("true");
    expect(screen.getByText("Release candidate")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Web — Public beta" }));

    expect(onSelect).toHaveBeenCalledWith("web");
    expect(screen.getByRole("tab", { name: "iOS — In development" })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "Android — Release candidate" })).toHaveAttribute("tabindex", "0");
  });

  it("keeps keyboard selection, focus, and status in sync with the shared indicator", () => {
    const ControlledTabs = () => {
      const [value, setValue] = useState<ProjectPlatformId>("android");
      return <ProjectPlatformTabs platforms={platforms} activePlatform={value} onSelect={setValue} label="Platforms" />;
    };
    render(<ControlledTabs />);
    const [android, web, ios] = screen.getAllByRole("tab") as [HTMLButtonElement, HTMLButtonElement, HTMLButtonElement];

    fireEvent.keyDown(android, { key: "ArrowLeft" });
    expect(ios).toHaveFocus();
    expect(ios).toHaveAttribute("aria-selected", "true");
    expect(ios).toHaveAttribute("tabindex", "0");
    expect(android).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("In development")).toBeInTheDocument();

    fireEvent.keyDown(ios, { key: "Home" });
    expect(android).toHaveFocus();
    fireEvent.keyDown(android, { key: "ArrowRight" });
    expect(web).toHaveFocus();
    fireEvent.keyDown(web, { key: "End" });
    expect(ios).toHaveFocus();
    expect(ios).toHaveAttribute("aria-selected", "true");
  });
});
