import { expect, test } from "@playwright/test";
import { publicProjectsCatalog } from "../../src/data/projectCatalog";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_URL } from "../../src/data/siteMetadata";
import { messages } from "../../src/i18n/messages";

for (const [route, locale, label, home] of [
  ["/missing-release-page", "en", "Return home", "/"],
  ["/ru/projects/missing-release-page", "ru", "На главную", "/ru"],
] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`keeps the ${locale} static 404 localized in ${theme} mode`, async ({ page }) => {
      await page.addInitScript((mode) => localStorage.setItem("theme-mode", mode), theme);
      const response = await page.goto(route);
      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(messages[locale].seo.pageNotFound);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
      const link = page.getByRole("link", { name: label, exact: true });
      await expect(link).toHaveAttribute("href", home);
      await expect(page.locator("body")).toHaveCSS("background-color", theme === "dark" ? "rgb(10, 10, 10)" : "rgb(250, 250, 248)");
      await link.click();
      await expect(page).toHaveURL(`http://127.0.0.1:4173${home}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
}

test("serves project metadata before JavaScript and rejects missing resources", async ({ request }) => {
  for (const project of publicProjectsCatalog) {
    const response = await request.get(`/projects/${project.slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<title>${project.title} | Akbar Azizov</title>`);
    expect(html).toContain(`href="${SITE_URL}/projects/${project.slug}"`);
    expect(response.headers()["content-security-policy"]).toContain("script-src 'self'");
  }
  for (const route of ["/missing", "/projects/lumingo", "/projects/nonexistent-project-xyz", "/assets/missing.js", "/creative/assets/missing.js"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain(`${SITE_URL}/creative/`);
  expect(sitemap).not.toContain(`${SITE_URL}/old/`);
  expect(sitemap).not.toContain("/projects/lumingo");
  for (const project of publicProjectsCatalog) expect(sitemap).toContain(`/projects/${project.slug}`);
});

for (const [route, locale] of [["/", "en"], ["/ru", "ru"]] as const) {
  test(`reports denied phone copying in ${locale}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => { throw new DOMException("Clipboard denied", "NotAllowedError"); },
        },
      });
    });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(route);
    await page.locator("#home").getByRole("button", { name: messages[locale].hero.contact }).click();
    const dialog = page.getByRole("dialog", { name: messages[locale].contact.title });
    await dialog.getByRole("button", { name: messages[locale].contact.phoneRevealAria }).click();
    await expect(dialog.getByRole("alert")).toHaveText(messages[locale].contact.phoneCopyFailed);
    const number = dialog.getByText("+998 90 964 67 69", { exact: true });
    await expect(number).toBeVisible();
    await expect(number.locator("..")).toHaveCSS("opacity", "1");
    await expect(dialog).toHaveCSS("opacity", "1");
    await expect(dialog.locator("..")).toHaveCSS("opacity", "1");
    await expect(dialog.getByText(messages[locale].contact.phoneCopied, { exact: true })).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath("phone-copy-failure.png") });
  });
}

test("serves the CV in the language of each home page", async ({ page, request }) => {
  for (const [path, locale] of [["/", "en"], ["/ru", "ru"]] as const) {
    await page.goto(path);
    const href = await page
      .getByRole("link", { name: messages[locale].hero.downloadCv })
      .getAttribute("href");
    expect(href, path).toContain(`_${locale.toUpperCase()}.pdf`);
    const response = await request.get(href!);
    expect(response.status(), href!).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
});

test("keeps a single set of route metadata through navigation and reload", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/projects/voicenotes"]').filter({ hasText: "Open case study" }).click();
  await expect(page).toHaveTitle("AI Voice Notes | Akbar Azizov");
  const canonical = page.locator('link[rel="canonical"]');
  const description = page.locator('meta[name="description"]');
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute("href", `${SITE_URL}/projects/voicenotes`);
  await expect(description).toHaveCount(1);
  await expect(ogTitle).toHaveCount(1);
  await expect(ogTitle).toHaveAttribute("content", "AI Voice Notes | Akbar Azizov");
  await page.reload();
  await expect(description).toHaveCount(1);
  await page.getByRole("link", { name: "Back to projects", exact: true }).click();
  await expect(page).toHaveTitle(HOME_TITLE);
  await expect(canonical).toHaveAttribute("href", `${SITE_URL}/`);
  await expect(description).toHaveAttribute("content", HOME_DESCRIPTION);
  await expect(ogTitle).toHaveAttribute("content", HOME_TITLE);
  const sectionTop = await page.locator("#projects").evaluate((element) => element.getBoundingClientRect().top);
  const navBottom = await page.locator("nav").first().evaluate((element) => element.getBoundingClientRect().bottom);
  expect(sectionTop).toBeGreaterThanOrEqual(navBottom);
});

test("supports keyboard theme selection and exposes only usable gallery controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/voicenotes");
  const trigger = page.getByRole("button", { name: "Select theme" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Light" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Dark" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(trigger).toBeFocused();
  const gallery = page.getByRole("region", { name: "Project screens carousel" });
  await expect(gallery.getByRole("button")).toHaveCount(6);
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.getByRole("button", { name: "Show screen 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(gallery.getByRole("button", { name: "Show screen 1", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(gallery.getByRole("button", { name: "Show screen 6", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("renders and switches theme when browser storage is denied", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() { throw new DOMException("Storage denied", "SecurityError"); },
    });
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Select theme" }).click();
  await page.getByRole("menuitem", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(errors).toEqual([]);
});

test("three logo clicks offer Creative mode, which links back to Business", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const logo = page.locator("nav").getByRole("link").first();
  for (let click = 0; click < 3; click += 1) await logo.click();
  const versions = page.getByRole("dialog", { name: messages.en.hiddenVersions.title });
  await expect(versions).toBeVisible();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await versions.getByRole("link", { name: /^Creative/ }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/creative/");
  await page.getByRole("link", { name: "Business", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Android Engineer");
});

test("keeps tablet navigation clear of the logo", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Projects", exact: true }).click();
  await menu.getByRole("link", { name: "AI Voice Notes", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/voicenotes$/);
  await expect(menu).toHaveCount(0);
});

test("keeps screenshots visible if the optional AVIF variant is unavailable", async ({ page }) => {
  await page.route("**/projects/voicenotes/*.avif", (route) => route.fulfill({ status: 404, body: "" }));
  await page.goto("/projects/voicenotes");
  const image = page.getByRole("region", { name: "Project screens carousel" }).getByRole("button", { name: "Show screen 1", exact: true }).locator("img");
  await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(image).toHaveJSProperty("currentSrc", "http://127.0.0.1:4173/projects/voicenotes/screen-01.webp");
});
