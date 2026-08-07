# Lumingo Portfolio Design

## Goal

Present Lumingo as the primary portfolio case and let visitors inspect Android,
Web, and iOS as distinct engineering surfaces of one product. Platform selection
must change the complete case-study narrative, not only the screenshot.

## Project Order

- Lumingo is project `01`.
- VoiceNotes is project `02`.
- The order is shared by the Business home page, Creative work list, project IDs,
  and next-project navigation.

## Project Colors

- Lumingo uses `#E85D04`.
- VoiceNotes uses `#2F6364`.
- Each project color is a reusable project token, not duplicated inline across
  components.
- The token controls project-specific active tabs, lines, links, focus rings,
  hover borders, and case-study accents while preserving readable foreground
  contrast.
- Neutral global navigation and non-project sections keep the existing site
  palette.

## Positioning

Lumingo remains one founder-led product with three platform views:

- Android: native release candidate.
- Web: live public beta.
- iOS: native client in development.

AI-assisted implementation is described accurately without weakening product
ownership. Product direction, architecture choices, validation, and release
acceptance remain Akbar's responsibility.

## Platform Content

Each Lumingo platform owns a complete content record:

- summary;
- role;
- metrics;
- overview;
- challenge;
- technologies;
- key features;
- engineering note;
- media type and screenshots.

The platform records use verified current technology:

### Android

- Kotlin
- Jetpack Compose
- Convex
- Clerk
- Ktor
- Hilt

The narrative focuses on native client architecture, Web-to-Android product
parity, mobile state handling, authentication, and LLM-backed operations.

### Web

- TypeScript
- Next.js
- React
- Convex
- Clerk
- OpenAI
- Upstash
- PostHog

The narrative focuses on the live product, adaptive learning workflow, identity,
backend state, AI operations, localization, analytics, and public-beta delivery.

### iOS

- Swift — `Planned`
- SwiftUI — `Planned`

The platform remains selectable and visibly labeled `In development`. Its copy
describes the planned native client, shared product contracts, and intended
platform experience. It must not imply that implementation or release is
complete.

## Home Card

- The Lumingo card defaults to Android.
- Selecting Android, Web, or iOS changes:
  - preview media;
  - description;
  - metrics;
  - displayed technologies.
- The project title, CTA, and preview link include the selected platform:
  - `/projects/lumingo?platform=android`
  - `/projects/lumingo?platform=web`
  - `/projects/lumingo?platform=ios`
- VoiceNotes keeps its existing single-surface behavior.

## Case Study

`ProjectDetail` owns one active-platform state. The header, gallery, engineering
note, Overview, Challenge, Stack, and Key Features all receive the same resolved
platform view.

- The initial state comes from the `platform` query parameter.
- Missing or invalid platform values fall back to Android.
- Selecting a tab updates the query parameter without leaving the page.
- Direct and shared URLs reopen the matching platform.
- Back and forward navigation restore the platform represented by the URL.
- The gallery resets to the first matching screenshot when the platform changes.

## Links

- Lumingo has no GitHub link because its source repository is not part of the
  public case.
- VoiceNotes retains its GitHub link.
- Project links therefore treat GitHub as optional rather than using an empty or
  placeholder URL.

## Creative Version

- Lumingo appears before VoiceNotes.
- Creative continues linking to the Business case rather than duplicating the
  platform selector.
- Its Lumingo link opens the default Android case unless a platform is explicitly
  encoded later.

## Accessibility

- The platform selector retains `tablist`, `tab`, `aria-selected`, readable
  statuses, and visible keyboard focus.
- Platform changes are expressed in text as well as media.
- No timed autoplay is introduced.

## Data Flow

1. The project catalog stores common project identity and optional platform
   content.
2. Summary and detail adapters expose a resolved platform view without duplicating
   transformation logic in UI components.
3. The home card owns its local platform selection and builds a platform-aware
   destination URL.
4. The detail route resolves its platform from the URL and passes one consistent
   view to all sections.

## Testing

- Data tests verify Lumingo-first order, exact platform stacks, iOS planned
  labels, and the absence of a Lumingo GitHub URL.
- Card tests verify that selection changes copy, metrics, technologies, media, and
  destination URLs.
- Detail tests verify query initialization, invalid-value fallback, URL updates,
  and synchronized content.
- Existing VoiceNotes and Creative behavior remain covered.
- Style tests verify the exact project color tokens and their use by shared
  project components.
- Final verification includes lint, cycle detection, TypeScript, unit tests,
  production builds, bundle budget, Playwright tests, and desktop/mobile visual
  inspection.

## Success Criteria

1. Lumingo is displayed before VoiceNotes everywhere projects are ordered.
2. Platform selection changes all Lumingo-specific content and screenshots.
3. A platform selected on the home card opens the same platform in the case study.
4. Direct platform URLs and browser history resolve consistently.
5. iOS is ambitious but explicitly planned and in development.
6. Lumingo exposes no GitHub link.
7. VoiceNotes remains functionally unchanged.
8. All automated and visual checks pass.
