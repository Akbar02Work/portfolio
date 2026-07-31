import { expect, test } from "@playwright/test";

test("blocks Creative on mobile and skips the desktop experience", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/creative/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Обломись." }),
  ).toBeVisible();
  await expect(page.locator(".site")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("does not advertise the Creative switch below desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Creative", exact: true })).toHaveCount(0);
});

test("renders the Creative experience on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/creative/");

  await expect(
    page.getByRole("heading", { level: 1, name: /akbar builds signal/i }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".site")).toBeVisible();
});
