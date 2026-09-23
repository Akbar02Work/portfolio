# Akbar — Signal Lab

Experimental wow-portfolio maintained as the `creative/` app inside the main
portfolio repository. Its source stays isolated from the Business app while both
ship from one clone.

Creative is desktop-only. On viewports below 901 px, the app shows an access gate
instead of mounting the desktop experience, effects, or navigation.
The desktop module is loaded lazily, so mobile visitors also skip GSAP, Lenis,
and WebGL code. Reduced motion uses a vertical case list and disables the shader,
custom cursor, smooth scrolling, and animated reveals, including live preference
changes.

## Why this exists

A cinematic craft prototype inspired by:
- [specia1ne.com](https://specia1ne.com/) — typographic restraint + reveal systems
- [stabondar.com](https://www.stabondar.com/) — loader, Lenis, page energy
- [otsuka-air.jp](https://otsuka-air.jp/) — WebGL atmosphere

## Stack

- React + Vite + TypeScript
- GSAP ScrollTrigger
- Lenis smooth scroll
- Custom WebGL fragment shader (no Three.js)

## Run

```bash
npm install
npm run dev
```

Open the local URL and scroll slowly. Desktop hits hardest (custom cursor + pin scrub).

## Shared release

Run `npm run build:creative` from the repository root to refresh `public/creative/`.
The root CI checks this generated output without overwriting it. Production
switches use `/` and `/creative/` on the current origin; development URLs and
explicit environment overrides remain supported.

Public project slugs are derived at build time from the Business catalog's
`published` flags. `src/siteData.ts` owns Creative copy and local cards. Adding a
new case requires Creative presentation data as well as a catalog entry; the
build-time slug list controls visibility and order, not editorial content.
