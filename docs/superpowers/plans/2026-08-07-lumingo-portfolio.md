# Platform-Aware Lumingo Case Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Lumingo the primary project and synchronize Android, Web, and iOS selection across card content, URLs, complete case-study content, screenshots, and project-specific colors.

**Architecture:** Extend the catalog with complete per-platform content and optional external links. Data adapters expose platform views; the home card owns local selection, while the detail route owns URL-backed selection and passes one resolved view to every section. A CSS custom property sourced from `ProjectStyle.accentColor` provides one reusable accent token per project.

**Tech Stack:** React 19, React Router 7, TypeScript, Vitest, Testing Library, Playwright, Tailwind CSS, Vite 8.

## Global Constraints

- Lumingo is project `01`; VoiceNotes is project `02`.
- Lumingo uses `#E85D04`.
- VoiceNotes uses `#2F6364`.
- Android defaults to `Release candidate`.
- Web uses `Public beta`.
- iOS uses `In development`; `Swift` and `SwiftUI` are labeled `Planned`.
- Lumingo has no GitHub URL; VoiceNotes keeps its public GitHub URL.
- Invalid or missing Lumingo platform query values resolve to Android.
- No production dependency is added.
- VoiceNotes single-surface behavior remains unchanged.

---

### Task 1: Platform content model and project order

**Files:**
- Modify: `src/data/projectCatalog.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/projectsSummary.ts`
- Modify: `src/data/__tests__/projects.test.ts`

**Interfaces:**
- Produces: `ProjectPlatformContent`, `ProjectPlatformView`, `ProjectSummaryPlatformView`.
- Produces: `resolveProjectPlatform(project, platformId)` and `resolveProjectSummaryPlatform(project, platformId)`.
- Consumes: existing catalog transformation and gallery media normalization.

- [ ] **Step 1: Write failing data tests**

Add assertions that:

```ts
expect(projects.map((project) => project.slug)).toEqual(["lumingo", "voicenotes"]);
expect(lumingo?.links.github).toBeUndefined();
expect(resolveProjectPlatform(lumingo!, "web").technologies).toEqual([
  "TypeScript", "Next.js", "React", "Convex", "Clerk", "OpenAI", "Upstash", "PostHog",
]);
expect(resolveProjectPlatform(lumingo!, "ios").technologies).toEqual([
  "Swift · Planned", "SwiftUI · Planned",
]);
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run src/data/__tests__/projects.test.ts`

Expected: failures for order, required GitHub, missing platform content, and missing resolver.

- [ ] **Step 3: Implement the catalog and adapters**

Add complete Android, Web, and iOS records containing:

```ts
type ProjectPlatformContent = ProjectPlatform & {
  summary: string;
  role: string;
  metrics: ProjectMetric[];
  overview: string;
  challenge: string;
  stack: string[];
  keyFeatures: string[];
  engineeringNote: string;
};
```

Make `links.github` optional, move Lumingo before VoiceNotes, and resolve platform
fields without mutating the base project.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --run src/data/__tests__/projects.test.ts`

Expected: PASS.

### Task 2: Project accent tokens

**Files:**
- Modify: `src/constants/projectStyles.ts`
- Create: `src/constants/__tests__/projectStyles.test.ts`
- Modify: `src/components/project/EditorialCard.tsx`
- Modify: `src/pages/ProjectDetail.tsx`
- Modify: `src/components/project/ProjectPlatformTabs.tsx`
- Modify: shared project detail components that currently use Volt project accents.
- Modify: `creative/src/index.css`

**Interfaces:**
- Produces: `ProjectStyle.accentColor`.
- Produces: inherited CSS variable `--project-accent`.
- Consumes: existing `ProjectStyle` lookup by slug.

- [ ] **Step 1: Write failing style tests**

```ts
expect(projectStylesBySlug.lumingo?.accentColor).toBe("#E85D04");
expect(projectStylesBySlug.voicenotes?.accentColor).toBe("#2F6364");
```

Render the tab selector beneath `--project-accent` and assert the selected tab
uses `bg-[var(--project-accent)]`.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run src/constants/__tests__/projectStyles.test.ts src/components/project/__tests__/ProjectPlatformTabs.test.tsx`

Expected: failure because the accent token and accent classes are absent.

- [ ] **Step 3: Implement shared project accents**

Set:

```ts
lumingo: { accentColor: "#E85D04" }
voicenotes: { accentColor: "#2F6364" }
```

Expose `--project-accent` on each EditorialCard and the detail root. Replace
project-local Volt classes with `var(--project-accent)` for active tabs, lines,
links, focus states, gallery rings, and project-specific Creative glows.

- [ ] **Step 4: Verify GREEN**

Run the two targeted test files and `npm --prefix creative run lint`.

Expected: PASS.

### Task 3: Platform-aware home card

**Files:**
- Modify: `src/components/project/EditorialCard.tsx`
- Modify: `src/components/project/ProjectCardMedia.tsx`
- Modify: `src/components/project/__tests__/ProjectCardMedia.test.tsx`
- Create: `src/components/project/__tests__/EditorialCard.platforms.test.tsx`
- Modify: `src/constants/routes.ts`
- Modify: `src/__tests__/urls.test.ts`

**Interfaces:**
- Produces: `buildProjectUrl(slug, platformId?)`.
- `EditorialCard` owns `activePlatform`.
- `ProjectCardMedia` consumes `activePlatform` and `onPlatformChange`.

- [ ] **Step 1: Write failing card and URL tests**

Assert that Web selection changes visible summary, metrics, technologies, media,
and all Lumingo case-study links to:

```text
/projects/lumingo?platform=web
```

Assert that VoiceNotes still links to `/projects/voicenotes`.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- --run src/components/project/__tests__/EditorialCard.platforms.test.tsx src/components/project/__tests__/ProjectCardMedia.test.tsx src/__tests__/urls.test.ts
```

Expected: failure because text and destinations remain Android/base content.

- [ ] **Step 3: Implement controlled card selection**

Move platform state from `ProjectCardMedia` into `EditorialCard`. Resolve one
summary view and use it for text, metrics, technologies, image, and every
destination link.

- [ ] **Step 4: Verify GREEN**

Run the same targeted tests.

Expected: PASS.

### Task 4: URL-backed case-study selection

**Files:**
- Modify: `src/pages/ProjectDetail.tsx`
- Modify: `src/components/project/ProjectGallery.tsx`
- Modify: `src/components/project/__tests__/ProjectGallery.platforms.test.tsx`
- Create: `src/pages/__tests__/ProjectDetail.platforms.test.tsx`

**Interfaces:**
- `ProjectDetail` owns the resolved `ProjectPlatformId`.
- `ProjectGallery` consumes `activePlatform` and `onPlatformChange`.
- All detail sections receive the same resolved `Project` view.

- [ ] **Step 1: Write failing route tests**

Using `MemoryRouter`, verify:

```ts
"/projects/lumingo?platform=web" -> Web summary, TypeScript, Web screenshots
"/projects/lumingo?platform=ios" -> iOS summary, Swift · Planned, no GitHub
"/projects/lumingo?platform=wrong" -> Android summary and selected Android tab
```

Click Web and assert the URL query and all rendered sections change together.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- --run src/pages/__tests__/ProjectDetail.platforms.test.tsx src/components/project/__tests__/ProjectGallery.platforms.test.tsx
```

Expected: failure because the gallery owns isolated state and the route ignores
the query.

- [ ] **Step 3: Implement one detail state**

Use `useSearchParams`. Resolve invalid or absent values to Android. Update the
query on tab selection and pass the resolved view into `ProjectHeader`,
`ProjectEngineeringNote`, `ProjectDetailsSection`, and `ProjectGallery`.

- [ ] **Step 4: Verify GREEN**

Run the same targeted tests.

Expected: PASS.

### Task 5: Creative order, documentation, and browser contracts

**Files:**
- Modify: `creative/src/siteData.ts`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `tests/e2e/critical-flows.spec.ts`
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: final project order and platform-aware URLs.
- Produces: user-visible documentation and regression coverage.

- [ ] **Step 1: Write failing E2E assertions**

Assert Lumingo is the first case-study link, selecting Web opens a URL ending in
`?platform=web`, and Web content is visible after navigation.

- [ ] **Step 2: Verify RED**

Run the targeted Playwright test and confirm it fails against the current order
or missing query behavior.

- [ ] **Step 3: Update Creative and docs**

Put Lumingo before VoiceNotes in Creative, use its Business case link, update
README ordering, and record the platform-content milestone in CHANGELOG.

- [ ] **Step 4: Verify GREEN**

Run Creative lint and the targeted E2E test.

Expected: PASS.

### Task 6: Complete verification and preview

**Files:**
- Modify only if a verified in-scope defect is found.

**Interfaces:**
- Consumes: all completed tasks.
- Produces: reviewable local preview and verification evidence.

- [ ] Run `npm run lint:all`.
- [ ] Run `npm --prefix creative run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run check:bundle`.
- [ ] Run `npm run test:e2e`.
- [ ] Run `git diff --check`.
- [ ] Inspect Business desktop and mobile layouts for Android, Web, and iOS.
- [ ] Confirm VoiceNotes remains single-surface and retains GitHub.
- [ ] Leave the preview branch available for user review.
