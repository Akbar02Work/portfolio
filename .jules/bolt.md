## 2025-05-18 - [Static Asset Imports in Shared Data]
**Learning:** Shared data files (like `projects.ts`) that import assets (images) directly will include those assets in the main bundle if the data file is imported by the entry chunk, even if the assets are only used in lazy-loaded routes.
**Action:** Use string paths for assets in shared data and keep assets in `public/` or `src/assets` without direct import if they are only needed in specific routes, to allow proper splitting.
