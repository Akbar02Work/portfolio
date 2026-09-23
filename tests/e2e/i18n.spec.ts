import { expect, test } from "@playwright/test";
import { SITE_URL } from "../../src/data/siteMetadata";
import { messages } from "../../src/i18n/messages";

const ru = messages.ru;

test("serves prerendered Russian routes with language metadata", async ({ request }) => {
  for (const [path, title] of [
    ["/ru", ru.seo.homeTitle],
    ["/ru/projects/voicenotes", ru.seo.projectTitle("VoiceNotes")],
  ] as const) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain('<html lang="ru">');
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain(`hreflang="ru" href="${SITE_URL}${path}"`);
    expect(html).toContain('hreflang="x-default"');
  }

  const english = await (await request.get("/")).text();
  expect(english).toContain('<html lang="en">');
  expect(english).toContain(`og:image" content="${SITE_URL}/og-image.png"`);
  expect(await (await request.get("/ru")).text()).toContain(`og:image" content="${SITE_URL}/og-image-ru.png"`);
  expect((await request.get("/og-image-ru.png")).status()).toBe(200);
  expect(english).toContain(`hreflang="ru" href="${SITE_URL}/ru"`);

  expect((await request.get("/ru/missing")).status()).toBe(404);
  expect((await request.get("/ru/projects/lumingo")).status()).toBe(404);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${SITE_URL}/ru</loc>`);
  expect(sitemap).toContain(`<loc>${SITE_URL}/ru/projects/voicenotes</loc>`);
  expect(sitemap).not.toContain("/ru/projects/lumingo");
});

test("renders the Russian site and keeps navigation inside the locale", async ({ page }) => {
  // Instant route changes: the page-transition curtain ignores clicks while it runs.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(ru.hero.roleLine1);
  await expect(page.getByRole("heading", { level: 2, name: ru.projects.title })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}/ru`);

  await page.getByRole("link", { name: ru.projects.openCase, exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/projects\/voicenotes/);
  await expect(page.getByRole("heading", { level: 2, name: ru.project.overview })).toBeVisible();
  await expect(page.getByText("Задача была не просто вызвать AI API", { exact: false })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Архитектура обработки VoiceNotes" })).toBeVisible();

  await page.getByRole("link", { name: ru.project.back, exact: true }).click();
  await expect(page).toHaveURL(/\/ru$/);

  await page.locator("#home").getByRole("button", { name: ru.hero.contact }).click();
  await expect(page.getByRole("dialog", { name: ru.contact.title })).toBeVisible();
});

test("language switch keeps the page, remembers the choice and never auto-detects", async ({ browser }) => {
  const context = await browser.newContext({ locale: "ru-RU" });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // Browser language alone does not redirect.
  await page.goto("/projects/voicenotes?platform=android");
  await expect(page).toHaveURL(/\/projects\/voicenotes\?platform=android$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "Русский" }).click();
  await expect(page).toHaveURL(/\/ru\/projects\/voicenotes\?platform=android$/);
  await expect(page.getByRole("heading", { level: 2, name: ru.project.overview })).toBeVisible();

  // The explicit choice is honoured on the next visit to an English URL.
  await page.goto("/");
  await expect(page).toHaveURL(/\/ru$/);

  await page.getByRole("group", { name: ru.nav.language }).getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await context.close();
});

test("mobile menu exposes the language switch", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Русский" }).click();
  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.getByRole("dialog", { name: ru.nav.menuTitle })).toHaveCount(0);
  await expect(page.getByRole("button", { name: ru.nav.openMenu })).toBeVisible();
});

test("the language thumb can be dragged and applies the language on release", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const group = page.getByRole("group", { name: "Language" });
  const box = (await group.boundingBox())!;
  const y = box.y + box.height / 2;

  // A short drag that ends on the same side keeps the language.
  await page.mouse.move(box.x + 20, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 30, y, { steps: 4 });
  await page.mouse.up();
  await expect(page).toHaveURL(/\/$/);

  // Dragging across the middle switches on release.
  await page.mouse.move(box.x + 20, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 70, y, { steps: 8 });
  await expect(page).toHaveURL(/\/$/);
  await page.mouse.up();
  await expect(page).toHaveURL(/\/ru$/);
});

test("theme menu opens on hover without stealing focus", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Select theme" });
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menuitem", { name: "Dark" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Dark" })).not.toBeFocused();
  await page.mouse.move(10, 400);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
