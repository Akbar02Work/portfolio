# Akbar — Signal Lab

Creative is the independent React 19 / Vite / TypeScript app in this repository.
It uses GSAP ScrollTrigger, Lenis and a custom WebGL fragment shader. Business
provides the conventional portfolio; Creative presents the same engineer through
motion and atmosphere.

## Experience

- Desktop starts at 901 px. Below it, a Russian access gate links back to Business.
  The lazy desktop module, GSAP, Lenis and WebGL are not loaded by the mobile gate.
- Desktop content is English. Reduced motion uses a vertical case list and disables
  the shader, custom cursor, smooth scrolling and animated reveals; live preference
  changes are handled too.
- Three quick logo clicks on the Business home page open the Creative/Old chooser.
  Production links use the current origin; dev uses Business port 5173 and
  Creative HTTPS port 5174.
- Visual references: [specia1ne](https://specia1ne.com/),
  [stabondar](https://www.stabondar.com/), [otsuka-air](https://otsuka-air.jp/).

## Develop and release

Use Node.js 24. From the repository root:

```bash
npm --prefix creative ci
npm --prefix creative run dev
```

`npm run dev:pair` runs both apps on Linux/macOS. Build or lint Creative alone with
`npm --prefix creative run build` / `npm --prefix creative run lint`; a standalone
build does not refresh the root embed.

For deployment, run `npm run build:creative` from the root on Linux/macOS. It builds
with `VITE_BASE_URL=/creative/` and `VITE_BUSINESS_URL=/`, then replaces
`public/creative/`. Include that output with its source changes. Root
`check:creative-drift` rebuilds and compares without refreshing the embed.
See the [root build and checks](../README.md#build-and-embed) for the full pipeline.

## Data and configuration

`creative/vite.config.ts` injects public project slugs/order from the Business
catalog at build time. `src/siteData.ts` owns Creative presentation and local cards
such as This Lab. New public cases need both a catalog entry and Creative copy;
changing publication requires rebuilding the embed. Lumingo is currently hidden.

`VITE_BUSINESS_URL` overrides the return destination; `VITE_BASE_URL` controls the
asset base. Their defaults and deployment limits are in the
[root README](../README.md#configuration-and-release).
