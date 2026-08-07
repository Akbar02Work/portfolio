import { expect, test } from "@playwright/test";

test("home renders hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /android developer/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /about me/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Selected Works" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open case study", exact: true })).toHaveCount(2);
});
