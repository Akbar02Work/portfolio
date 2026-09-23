# Akbar Azizov — Android × AI

[![CI](https://github.com/Akbar02Work/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Akbar02Work/portfolio/actions/workflows/ci.yml)

<p align="center">
  <a href="https://www.akbar02work.xyz">
    <img src="public/og-image.png" alt="Business portfolio preview" width="49%" />
  </a>
  <a href="https://www.akbar02work.xyz/creative/">
    <img src="public/creative/og-image.png" alt="Creative portfolio preview" width="49%" />
  </a>
</p>

**One portfolio, two ways to read the same engineer.**

[Business](https://www.akbar02work.xyz) is the direct version: work, decisions, and
evidence. [Creative](https://www.akbar02work.xyz/creative/) is the expressive
version: motion, atmosphere, and personality. They are intentionally different
interfaces, but they ship from one repository and one release pipeline.
Creative is intentionally a desktop-only experience: below 901 px it shows an
access gate and keeps its desktop interactions out of the mobile runtime.
Business is available in English and [Russian](https://www.akbar02work.xyz/ru);
Creative stays English.

## Why two versions?

Most portfolios force engineering credibility and creative identity into the same
layout. This one keeps the tension visible.

| Business | Creative |
| --- | --- |
| Editorial and restrained | Kinetic and cinematic |
| Optimized for scanning | Designed for exploration |
| Project evidence first | Personality and atmosphere first |
| React app at the repository root | Independent React app in [`creative/`](creative/) |

The switch between them is part of the product idea—not a theme toggle. Each
version answers a different question: “Can this person build the work?” and “What
does it feel like to work with this person?”

## The engineering behind the presentation

This repository is more than a generated landing page. Its difficult parts live
at the seams:

- **Two applications, one deploy.** The Creative app is built independently,
  embedded at `/creative/`, and checked for output drift before CI can pass.
- **A case study, not a card grid.** Project data is modeled once and transformed
  into summaries, detail pages, metrics, galleries, and navigation without
  duplicating editorial content.
- **Motion with an exit path.** WebGL, scroll choreography, view transitions, and
  desktop interaction add character while reduced-motion behavior, keyboard
  navigation, semantic markup, and a conventional Business version keep the site
  usable.
- **Static hosting without static UX.** Client-side routes, direct project URLs,
  `/creative/`, `/old/`, metadata, and 404 behavior are prepared for a single
  Vercel deployment.
- **Two languages without a runtime framework.** A typed EN/RU dictionary with a
  parity test, locale-prefixed routes (`/ru/...`) prerendered with `lang`,
  hreflang alternates and sitemap entries, and Cyrillic font subsets that load
  only when Cyrillic text renders.
- **Privacy as a release constraint.** Public media is deliberately curated;
  project screenshots, the downloadable CV, claims, and external links are
  reviewed as publishable product data rather than copied into `public/`
  indiscriminately.
- **Quality gates that match the architecture.** Linting, cycle detection,
  TypeScript, unit tests, production builds, bundle budgets, Creative embed drift,
  and Playwright browser tests run as one CI contract.

The currently published case is:

- [VoiceNotes](https://www.akbar02work.xyz/projects/voicenotes), a native Android
  voice-to-notes system that turns short recordings into searchable notes through
  cloud providers or a verified on-device Russian transcription path.

Lumingo's Android, Web, and iOS case data remains in the repository with
`published: false`. The catalog in `src/data/projectCatalog.ts` controls public
Business routes, summaries, navigation, the generated sitemap, and Creative case
visibility. Creative retains its own presentation and the local “This Lab” card.

## Human direction, AI-assisted execution

AI tools were used as accelerators for exploration, implementation passes,
debugging, review, and documentation. They did not choose the product direction
or publish the result.

I remained responsible for the architecture, visual direction, project claims,
source selection, privacy review, trade-offs, and final release acceptance.
That boundary matters here: generated output is input to an engineering process,
not evidence of completion.

## Repository map

```text
src/                 Business portfolio and case-study system
src/i18n/            Locale routing and EN/RU interface copy
creative/            Creative portfolio application
public/creative/     Generated Creative embed shipped by the root app
scripts/             Build integration, route, image, cycle, and bundle checks
tests/               Browser-level release checks
docs/history/        Archived design and audit context
```

For a local review, use Node.js 24:

```bash
npm ci
npm --prefix creative ci
npm run dev:pair
```

`dev:pair` uses ports 5173 and 5174. An occupied port causes startup to fail without
stopping its owner. `npm run dev:pair:stop` stops only this checkout's supervisor
and its children.

`npm run build` builds Business with the committed Creative embed, so local builds
(including on Windows, where Creative's bundle hashes differ) leave `public/creative/`
untouched. `npm run build:all` rebuilds Creative first.

After changing Creative source or project publication, run `npm run build:creative`
on Linux/macOS (or let CI's drift check tell you) and include the resulting
`public/creative/` output with the source change.
`npm run check:creative-drift` rebuilds Creative and compares files byte for byte;
it never refreshes the embed during the check.

`npm run ci` checks both applications, script regressions, the Creative embed,
and gzip budgets (Business initial JS/CSS and all Creative JS/CSS, each 150 KiB).
It also builds Business route HTML (English and `/ru`) and `dist/sitemap.xml`
from the public catalog.
`npm run ci:full` adds Chromium E2E; first install it with
`npx playwright install chromium`. To check other engines, install `firefox webkit`
and run `npx playwright test --browser=firefox` and `--browser=webkit` after a build.

`npm run test:e2e` builds both applications before running browser checks. Tests
serve `dist/` using `scripts/serve-static.mjs` and the routing/header rules from
`vercel.json`, including static 404 responses. This bounded local server is not a
Vercel emulator; production edge behavior still needs a deployment smoke check.
`npm run preview` remains the standard Vite preview for interactive development.

For reproducible performance measurements, build first, then run these **serially**
from the repository root with other browser tests stopped:

```bash
node scripts/profile-performance.mjs before
node scripts/profile-interactions.mjs before
node scripts/profile-navigation.mjs before
```

Repeat with `after` following a change. The load and navigation labs use Chromium,
4× CPU slowdown, 150 ms latency, and 1.6 Mbps download; the interaction profiler
uses unthrottled networking and exports CPU profiles and call counts. Reports go
to ignored `logs/performance/<label>/`; `PERF_OUTPUT_DIR` overrides the report root.
Use `PERF_RUNS` for load/navigation repetitions, `PERF_SCENARIOS` for load scenario
names, and `PERF_ROUTES` for interaction routes. `PORTFOLIO_DIST_DIR` and
`PORTFOLIO_CONFIG` select saved build/config snapshots for an A/B check. Lab ports
are 4180, 4181, and 4182. Gzip delivery is enabled only for these lab servers.
`PERF_FLOW=projects node scripts/profile-navigation.mjs after` measures opening
the case study and returning to the list, including completion of the curtain.

These are local comparisons, not Lighthouse scores or real-device INP/FPS.
The [performance report](docs/audits/2026-09-05-performance-optimization.md)
defines the metrics, trade-offs, and measured before/after results.

Critical images are preloaded by route using the same responsive portrait sizes
as the React view. The phone bezel has a 512 px WebP variant; regenerate it with
`npm run optimize:images -- --phone-frame`. Vercel caches unversioned fonts,
portraits, project images, and mockups for one day (rename an asset for an immediate refresh), while hashed
JS/CSS retain their immutable cache policy. HTML receives no long-lived override.

## License

The source code is available under the MIT License. The portfolio's visual
identity, written content, personal brand, CV, photographs, and project media are
not licensed for reuse. See [LICENSE](LICENSE) for the exact boundary.
