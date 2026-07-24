# Akbar Azizov — Portfolio

Source for [akbar02work.xyz](https://www.akbar02work.xyz), a static portfolio for
Android and AI engineering work.

The repository contains both portfolio experiences:

- The Business site at the repository root.
- The Creative site in `creative/`, published at `/creative/`.

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS
- React Router
- Vitest and Playwright
- Vercel static hosting

## Project structure

- `src/components` — layout, sections, project presentation, and shared UI
- `src/data` — project catalog and derived view models
- `src/hooks` — navigation, theme, and scroll behavior
- `src/pages` — home, project detail, Easter, and client-side 404 pages
- `public` — static fonts, icons, social image, CV, and safe public media
- `scripts` — bundle checks, image optimization, route prerendering, and cycle checks

## Local development

```bash
npm install
npm --prefix creative install
npm run dev
```

Run both sites locally with `npm run dev:pair`. To rebuild the Creative site
embedded at `/creative/`, run `npm run embed:creative`.

The production `npm run build` command builds both applications and refreshes
the committed `/creative/` embed automatically.

## Quality gates

```bash
npm run ci
npm run ci:full
```

`ci` checks Creative lint/build/embed drift plus Business linting, cycle
detection, TypeScript, unit tests, production build, and the initial-payload
budget. `ci:full` additionally runs Playwright.

## Content safety

Only deliberately public, reviewed media belongs in `public/`. Product screenshots
must not contain personal conversations, contact data, credentials, or unrelated
applications. Keep claims measurable and avoid publishing unverified reliability
percentages.

## AI-assisted development

AI assistants were used for implementation and review. Architecture, product
decisions, source selection, and final validation remain the repository owner's
responsibility.
