import { expect, test } from "@playwright/test";

test("blocks Creative on mobile and skips the desktop experience", async ({ page }) => {
  const requestedScripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") requestedScripts.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/creative/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Обломись." }),
  ).toBeVisible();
  await expect(page.locator(".site")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(requestedScripts.some((url) => url.includes("DesktopExperience-"))).toBe(false);
});

test("Business no longer advertises a Creative switch at any width", async ({ page }) => {
  for (const width of [844, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Creative", exact: true })).toHaveCount(0);
    await expect(page.getByRole("group", { name: "Site version" })).toHaveCount(0);
  }
});

test("renders the Creative experience on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/creative/");

  await expect(
    page.getByRole("heading", { level: 1, name: /akbar builds signal/i }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".site")).toBeVisible();
  await expect(page.locator(".work-card").first().getByRole("heading")).toHaveText(
    "VoiceNotes",
  );
  await expect(page.getByRole("heading", { name: "Lumingo" })).toHaveCount(0);
});

test("keeps every Creative case reachable with reduced motion, including preference changes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/creative/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await expect(page.locator("canvas, .cursor")).toHaveCount(0);
  for (const link of await page.locator(".work-card__link").all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport();
    await link.click({ trial: true });
  }
  await expect.poll(() => page.locator("[data-reveal]").evaluateAll((elements) =>
    elements.every((element) => Number(getComputedStyle(element).opacity) === 1)
  )).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas, .cursor")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.locator(".work-card__link").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".work-card__link").last()).toBeInViewport();
});

test("releases desktop effects when resized through the access gate", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/creative/");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".desktop-gate")).toBeVisible();
  await expect(page.locator("canvas, .cursor, .pin-spacer")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveClass(/is-loading/);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator(".preloader")).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator(".hero__title")).toBeVisible();
  expect(errors).toEqual([]);
});

test("restores direct Creative section links after the asynchronous desktop mount", async ({ page }) => {
  await page.goto("/creative/#contact");
  await expect(page.locator(".contact__email")).toBeInViewport({ timeout: 10_000 });
  await page.evaluate(() => { window.location.hash = "works"; });
  await expect(page.locator("#works-title")).toBeInViewport();
});

test("offers a working exit if the desktop chunk fails to load", async ({ page }) => {
  await page.route("**/creative/assets/DesktopExperience-*.js", (route) => route.abort());
  await page.goto("/creative/");
  await expect(page.getByRole("heading", { name: "Signal lost." })).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/is-loading/);
  await page.getByRole("link", { name: /Return to Business/ }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
});
