# Changelog

This file records meaningful public milestones, not every deployment or
dependency update.

## Unreleased — 2026-08-07

### Portfolio

- Added Lumingo as a multi-platform case study with selectable Android, Web,
  and iOS product surfaces.
- Promoted Lumingo to the primary case and gave every platform its own summary,
  metrics, stack, challenge, features, engineering note, and shareable URL.
- Made product maturity explicit: Android is a release candidate, Web is in
  public beta, and iOS is visibly in development with Swift and SwiftUI marked
  as planned.
- Added project accents (`#E85D04` for Lumingo and `#2F6364` for VoiceNotes)
  and kept Lumingo source links private.
- Added temporary product mockups so the presentation can be reviewed before
  replacing them with final release screenshots.

### Maintenance

- Upgraded the Business app from React Router 6 to 7.18.1 and removed the
  obsolete v7 future-flag configuration; declarative routes, direct URLs, 404,
  back/forward navigation, and project links remain covered by tests.
- Upgraded the root build from Vite 5 to 8.1.5, moved console/debugger removal
  to Rolldown minification, and adopted the Vite 8 React plugin.
- Kept automatic code splitting under the existing 150 KB initial gzip budget;
  the validated Business build is 110.81 KB.
- Re-ran the dependency audit: the previous Vite/esbuild findings are gone.
  The remaining React Router advisory is restricted to unstable RSC APIs and
  does not apply to this declarative client; a React 19 / Router 8 migration is
  intentionally tracked separately rather than forced into this maintenance pass.

## [2.0.0] — 2026-07-24

### One portfolio, two expressions

- Brought the Business and Creative experiences into one repository and one
  deployment, with an in-product switch between them.
- Established the MONO/VOLT visual system across the editorial Business site
  while keeping the Creative site deliberately cinematic and exploratory.
- Rebuilt the featured VoiceNotes work as a focused case study with safe,
  reviewed product media.

### Engineering

- Added a unified build that compiles Creative into `/creative/` and fails CI
  when the committed embed drifts from its source.
- Restored TypeScript, unit, production-build, bundle-budget, and Playwright
  gates; CI installs only the Chromium browser it uses.
- Fixed direct static routes, mobile navigation and layout, theme interaction,
  scroll behavior, reduced-motion handling, and 404 overflow.
- Removed unused dependencies, private or duplicate media, obsolete runtime
  behavior, and superseded planning documents.
- Added focused Dependabot coverage for both applications and GitHub Actions,
  grouping minor and patch updates while leaving major migrations manual.

### Repository

- Reframed the README as an engineering case study with an explicit account of
  AI-assisted work and human ownership.
- Split licensing so implementation code remains MIT while personal branding,
  design, writing, CV, photographs, and project media remain all rights reserved.
- Consolidated release documentation into this changelog.

## [1.0.0] — 2026-02-07

- Established the first production-ready Business portfolio.
- Added project detail routes, theme support, responsive navigation, SEO
  metadata, unit and browser tests, performance checks, and deployment
  hardening.

[2.0.0]: https://github.com/Akbar02Work/portfolio/releases/tag/v2.0.0
[1.0.0]: https://github.com/Akbar02Work/portfolio/commit/71258b0d5fd641f75a4f70e3d386d9291027ceff
