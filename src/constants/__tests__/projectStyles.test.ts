import { describe, expect, it } from "vitest";
import { projectStylesBySlug } from "@/constants/projectStyles";

describe("project styles", () => {
  it("uses one portfolio interaction accent for every project", () => {
    expect(projectStylesBySlug.lumingo?.hoverBorder).toBe(
      "hover:border-volt-ink dark:hover:border-volt"
    );
    expect(projectStylesBySlug.voicenotes?.hoverBorder).toBe(
      projectStylesBySlug.lumingo?.hoverBorder
    );
  });
});
