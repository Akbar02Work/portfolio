import { expect, test } from "@playwright/test";
import { messages } from "../../src/i18n/messages";

for (const [route, locale, width] of [["/", "en", 1440], ["/ru", "ru", 320]] as const) {
  test(`opens the ${locale} hidden versions after three clicks and restores keyboard focus`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 800 });
    const versionRequests: string[] = [];
    page.on("request", (request) => {
      const pathname = new URL(request.url()).pathname;
      if (/^\/(creative|old)\//.test(pathname)) versionRequests.push(pathname);
    });
    await page.goto(route);
    const logo = page.locator("nav").getByRole("link").first();
    await logo.click();
    await logo.click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await logo.click();
    const dialog = page.getByRole("dialog", { name: messages[locale].hiddenVersions.title });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(messages[locale].hiddenVersions.creative)).toBeVisible();
    await expect(dialog.getByText(messages[locale].hiddenVersions.old)).toBeVisible();
    const creative = dialog.getByRole("link", { name: /^Creative/ });
    const old = dialog.getByRole("link", { name: /^Old/ });
    await expect(creative).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(old).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: messages[locale].nav.closeMenu })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(creative).toBeFocused();
    expect(versionRequests).toEqual([]);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(logo).toBeFocused();
  });
}

test("opens hidden versions from the mobile menu without leaving another modal open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ru");
  await page.getByRole("button", { name: messages.ru.nav.openMenu }).click();
  const menu = page.getByRole("dialog", { name: messages.ru.nav.menuTitle, exact: true });
  const menuLogo = menu.getByRole("link").first();
  for (let click = 0; click < 3; click += 1) await menuLogo.click();
  const dialog = page.getByRole("dialog", { name: messages.ru.hiddenVersions.title });
  await expect(dialog).toBeVisible();
  await expect(menu).toHaveCount(0);
  await expect(dialog.getByRole("link", { name: /^Creative/ })).toBeFocused();
  await dialog.getByRole("button", { name: messages.ru.nav.closeMenu }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("nav").getByRole("link").first()).toBeFocused();
});

test("opens Old and returns to the current portfolio from an archive route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const logo = page.locator("nav").getByRole("link").first();
  for (let click = 0; click < 3; click += 1) await logo.click();
  await page.getByRole("dialog").getByRole("link", { name: /^Old/ }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/old/");
  await page.goto("/old/projects/voicenotes");
  const exit = page.getByRole("link", { name: "Return to the current portfolio" });
  await expect(exit).toBeVisible();
  await exit.click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Android Engineer");
});

test("keeps both hidden versions out of the sitemap and marks their HTML noindex", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/creative/");
  expect(sitemap).not.toContain("/old/");
  for (const route of ["/creative/", "/old/", "/old/projects/voicenotes"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('name="robots" content="noindex, nofollow"');
  }
  expect((await request.get("/styles/archive-return.css")).status()).toBe(200);
});
