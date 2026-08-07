import { describe, expect, it } from "vitest";
import { projectStylesBySlug } from "@/constants/projectStyles";

describe("project styles", () => {
  it("keeps the exact brand accent assigned to each featured project", () => {
    expect(projectStylesBySlug.lumingo?.accentColor).toBe("#E85D04");
    expect(projectStylesBySlug.voicenotes?.accentColor).toBe("#2F6364");
  });
});
