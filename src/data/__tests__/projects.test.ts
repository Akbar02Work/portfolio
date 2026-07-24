import { describe, expect, it } from "vitest";
import {
  createProject,
  projectsCatalog,
  type ProjectData,
  type ProjectMediaType,
} from "@/data/projectCatalog";
import { projects } from "@/data/projects";
import { projectsSummary } from "@/data/projectsSummary";

const validMediaTypes: ProjectMediaType[] = ["phone"];

describe("project data model", () => {
  it("keeps exactly three metrics and a supported media type per project", () => {
    for (const project of projectsCatalog) {
      expect(project.metrics).toHaveLength(3);
      expect(validMediaTypes).toContain(project.media.type);
      expect(project.media.alt.trim()).not.toBe("");
    }
  });

  it("defaults engineeringNote to an empty string", () => {
    const project = createProject({
      title: "Test Project",
      description: "Test description",
      role: "Test role",
      year: 2025,
      metrics: [
        { value: "1", label: "first" },
        { value: "2", label: "second" },
        { value: "3", label: "third" },
      ],
      media: { type: "phone", alt: "Test project screen" },
      links: { github: "https://github.com/example/test-project" },
      gallery: [],
      overview: "Test overview",
      challenge: "Test challenge",
      stackAndArchitecture: { stack: ["TypeScript"] },
      keyFeatures: ["Test feature"],
    });

    expect(project.engineeringNote).toBe("");
  });

  it("propagates editorial fields through projects and summaries", () => {
    const catalogBySlug = new Map(
      projectsCatalog.map((project) => [project.slug, project] as const)
    );

    for (const project of projects) {
      const catalogProject = catalogBySlug.get(project.slug);
      expect(catalogProject).toBeDefined();
      expect(project).toMatchObject({
        role: catalogProject?.role,
        year: catalogProject?.year,
        metrics: catalogProject?.metrics,
        media: catalogProject?.media,
        engineeringNote: catalogProject?.engineeringNote,
      } satisfies Partial<ProjectData>);
    }

    for (const summary of projectsSummary) {
      const project = projects.find((candidate) => candidate.slug === summary.slug);
      expect(summary).toMatchObject({
        year: project?.year,
        metrics: project?.metrics,
        media: project?.media,
      });
    }
  });

  it("exposes VoiceNotes screenshots for the editorial gallery", () => {
    const voiceNotes = projects.find((project) => project.slug === "voicenotes");
    expect(voiceNotes).toBeDefined();
    expect(voiceNotes?.image).toBe("/projects/voicenotes/screen-01.png");
    expect(voiceNotes?.screens.map((screen) => screen.image)).toEqual([
      "/projects/voicenotes/screen-01.webp",
      "/projects/voicenotes/screen-02.webp",
      "/projects/voicenotes/screen-03.webp",
    ]);

    const summary = projectsSummary.find((project) => project.slug === "voicenotes");
    expect(summary?.image).toBe("/projects/voicenotes/screen-01.webp");
  });
});
