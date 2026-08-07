import { describe, expect, it } from "vitest";
import {
  createProject,
  publicProjectsCatalog,
  projectsCatalog,
  type ProjectData,
  type ProjectMediaType,
} from "@/data/projectCatalog";
import { allProjects, projects, resolveProjectPlatform } from "@/data/projects";
import {
  allProjectsSummary,
  projectsSummary,
} from "@/data/projectsSummary";

const validMediaTypes: ProjectMediaType[] = ["phone", "browser"];

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
      "/projects/voicenotes/screen-04.webp",
      "/projects/voicenotes/screen-05.webp",
      "/projects/voicenotes/screen-06.webp",
    ]);

    const summary = projectsSummary.find((project) => project.slug === "voicenotes");
    expect(summary?.image).toBe("/projects/voicenotes/screen-01.webp");
  });

  it("models Lumingo as one product across Android, Web, and iOS", () => {
    const lumingo = allProjects.find((project) => project.slug === "lumingo");

    expect(lumingo).toBeDefined();
    expect(
      lumingo?.platforms.map(({ id, label, status, mediaType }) => ({
        id,
        label,
        status,
        mediaType,
      }))
    ).toEqual([
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
      ]);
    expect(
      lumingo?.screens.reduce<Record<string, number>>((counts, screen) => {
        counts[screen.platform] = (counts[screen.platform] ?? 0) + 1;
        return counts;
      }, {})
    ).toEqual({ android: 3, web: 3, ios: 1 });

    const summary = allProjectsSummary.find((project) => project.slug === "lumingo");
    expect(summary?.platforms.map((platform) => platform.id)).toEqual([
      "android",
      "web",
      "ios",
    ]);
    expect(summary?.platformPreviews.map((preview) => preview.image)).toEqual([
      "/projects/lumingo/android-01.svg",
      "/projects/lumingo/web-01.svg",
      "/projects/lumingo/ios-in-development.svg",
    ]);
  });

  it("keeps Lumingo data intact while excluding it from public collections", () => {
    expect(allProjects.map((project) => project.slug)).toEqual([
      "lumingo",
      "voicenotes",
    ]);
    expect(publicProjectsCatalog.map((project) => project.slug)).toEqual([
      "voicenotes",
    ]);
    expect(projects.map((project) => project.slug)).toEqual(["voicenotes"]);
    expect(projectsSummary.map((project) => project.slug)).toEqual([
      "voicenotes",
    ]);

    const lumingo = allProjects.find((project) => project.slug === "lumingo");
    expect(lumingo).toBeDefined();
    expect(lumingo?.links.github).toBeUndefined();

    const android = resolveProjectPlatform(lumingo!, "android");
    expect(android.technologies).toEqual([
      "Kotlin",
      "Jetpack Compose",
      "Convex",
      "Clerk",
      "Ktor",
      "Hilt",
    ]);
    expect(android.summary).toMatch(/native Android client/i);

    const web = resolveProjectPlatform(lumingo!, "web");
    expect(web.technologies).toEqual([
      "TypeScript",
      "Next.js",
      "React",
      "Convex",
      "Clerk",
      "OpenAI",
      "Upstash",
      "PostHog",
    ]);
    expect(web.summary).toMatch(/live web product/i);
    expect(web.challenge).not.toBe(android.challenge);

    const ios = resolveProjectPlatform(lumingo!, "ios");
    expect(ios.technologies).toEqual([
      "Swift · Planned",
      "SwiftUI · Planned",
    ]);
    expect(ios.summary).toMatch(/in development/i);
    expect(ios.engineeringNote).toMatch(/planned/i);
  });
});
