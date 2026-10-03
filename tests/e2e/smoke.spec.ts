import { expect, test } from "@playwright/test";

test("home renders hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /akbar.*android engineer.*founder of lumingo/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /about me/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Selected Projects" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open case study", exact: true })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Lumingo", exact: true, level: 3 })).toHaveCount(0);
});
