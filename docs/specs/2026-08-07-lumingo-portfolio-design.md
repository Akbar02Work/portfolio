# Lumingo: platform-aware case contract

Updated against the working tree on 2026-10-03. The platform model is implemented;
this describes current behavior, not an outstanding implementation plan.
Lumingo remains in development and unpublished by the owner's choice.

## Publication and identity

- `src/data/projectCatalog.ts` owns identity, order, English content and publication.
  Russian content lives in `src/data/i18n/projects.ru.ts`.
- `published: false` excludes Lumingo from public Business collections, navigation,
  route HTML, sitemap and Creative. Production direct URLs return 404.
- DEV previews: `/projects/lumingo?preview=1` and `/ru/projects/lumingo?preview=1`;
  append `&platform=web` or `&platform=ios` as needed.
- Catalog order is Lumingo → AI Voice Notes. Only published projects receive public
  sequence numbers; AI Voice Notes is currently the first visible case.
- The product link is `https://lumingo.me`. Lumingo has no GitHub link; shared
  components treat project links as optional.
- Project colors belong in media. Portfolio controls, focus and navigation use the
  shared accent; there is no per-project UI accent contract.

## Platform views

The catalog currently labels Android **Release candidate**, Web **Public beta**,
and iOS **In development**. Review these case-copy values before publication;
they do not mean every client has shipped. Swift/SwiftUI are explicitly planned.
Stacks and narratives live in the data files rather than being repeated here.

Each platform resolves its summary, role, metrics, overview, challenge,
technologies, key features, engineering note and gallery. The common title and
product identity stay the same.

- Home-card selection, when public, updates media, copy and destination URLs.
- Detail selection comes from the `platform` query. Missing or invalid values fall
  back to the first configured platform, currently Android.
- Selecting a tab updates the URL and all case sections; history restores selection.
- The gallery resets to the first matching screen when the platform changes.
- Tabs sit between the title/product link and summary. The separate Product surfaces
  block is gone; status remains in the tab's accessible label.
- Preserve keyboard arrows, Home/End and visible focus; do not add timed autoplay.

## Media and Creative

`public/projects/lumingo/*.svg` contains draft illustrations: three Android screens,
three Web screens and one iOS development image. Android uses phone framing, Web
browser framing. Prepare actual screenshots or clearly identify mockups before
enabling the case; the current hidden state is intentional.

Creative keeps its presentation in `creative/src/siteData.ts` and links to the
Business case. Public visibility/order are injected from the catalog at build
time. Publication changes require refreshing the embedded Creative output with
`npm run build:creative` on Linux/macOS.

## Future publication check

Publication requires a new request from the owner. Before changing the flag:

1. Confirm media, platform status and EN/RU claims.
2. Check direct platform URLs, invalid-query fallback, tab/history synchronization
   and the single-platform AI Voice Notes case.
3. Rebuild Creative, run relevant project tests and the release checks from the
   [root README](../../README.md#checks).
4. Confirm EN/RU routes, navigation, Creative and sitemap include the intended case.

The CV links to this hidden case are deliberately retained until publication.
