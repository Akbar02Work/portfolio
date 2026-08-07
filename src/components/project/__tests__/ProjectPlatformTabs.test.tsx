import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectPlatformTabs } from "@/components/project/ProjectPlatformTabs";
import type { ProjectPlatform } from "@/data/projectCatalog";

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
    expect(
      screen
        .getByRole("tab", { name: "Android — Release candidate" })
        .className
    ).toContain("bg-volt-ink");
  });
});
