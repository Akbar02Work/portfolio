import { expect, test } from "@playwright/test";

test("follows the editorial project detail flow", async ({ page }) => {
  await page.goto("/");

  await page
    .locator('a[href="/projects/voicenotes"]')
    .filter({ hasText: "Open case study" })
    .click();
  await expect(page).toHaveURL(/\/projects\/voicenotes$/);

  const detailFlow = page.locator("[data-project-detail]");
  await expect(
    detailFlow.locator(":scope > header").getByRole("heading", { level: 1, name: "VoiceNotes" })
  ).toBeVisible();

  const detailSections = detailFlow.locator(":scope > section");
  await expect(detailSections.nth(0).getByText("Screens", { exact: true })).toBeVisible();
  await expect(detailSections.nth(2).getByRole("heading", { level: 2, name: "Overview" })).toBeVisible();
});

test("keeps hidden Lumingo content out of public routes", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 3, name: "Lumingo" }),
  ).toHaveCount(0);

  await page.goto("/projects/lumingo");
  await expect(page.getByRole("heading", { level: 1, name: /404/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});

test("shows 404 for invalid project slug", async ({ page }) => {
  await page.goto("/projects/nonexistent-project-xyz");
  await expect(page.getByRole("heading", { level: 1, name: /404/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("restores scroll after reload", async ({ page }) => {
  await page.goto("/");

  await expect
    .poll(() => page.evaluate(() => window.history.scrollRestoration))
    .toBe("auto");

  await page.evaluate(() => {
    window.scrollTo(0, 900);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(800);

  // Exercise native reload: Firefox's automation reload can create a navigation entry.
  await Promise.all([
    page.waitForEvent("load"),
    page.evaluate(() => window.location.reload()),
  ]);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(400);

  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  const scrollAfterFirstWheel = await page.evaluate(() => window.scrollY);
  expect(scrollAfterFirstWheel).toBeGreaterThan(scrollY);

  const settledScrollY = await page.evaluate(() => window.scrollY);
  expect(settledScrollY).toBeGreaterThanOrEqual(scrollAfterFirstWheel);
});

test("rapid scroll reaches the footer without collapsing document height", async ({ page }) => {
  await page.addInitScript(() => {
    type HeightSample = { event: string; height: number };
    const samples: HeightSample[] = [];
    const record = (event: string) => {
      samples.push({ event, height: document.documentElement.scrollHeight });
    };

    (window as Window & { __scrollHeightSamples?: HeightSample[] }).__scrollHeightSamples = samples;
    window.addEventListener("load", () => {
      record("load");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => record("after-hydration"));
      });
    });
    window.addEventListener("scroll", () => record("scroll"), { passive: true });
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => {
    const state = window as Window & {
      __scrollHeightSamples?: Array<{ event: string; height: number }>;
    };
    return state.__scrollHeightSamples?.some((sample) => sample.event === "after-hydration") ?? false;
  })).toBe(true);

  const initialHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  // Firefox caps a single wheel delta. End still exercises one rapid jump to the footer.
  await page.mouse.wheel(0, initialHeight * 2);
  await page.keyboard.press("End");

  await expect
    .poll(() =>
      page.evaluate(() => {
        const opacities = Array.from(document.querySelectorAll(".translate-y-0")).map(
          (element) => Number.parseFloat(window.getComputedStyle(element).opacity)
        );
        return opacities.length > 0 && opacities.every((opacity) => opacity >= 0.99);
      })
    )
    .toBe(true);

  const footer = page.locator("footer#contact");
  await expect(footer).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(initialHeight - 850);
  await expect(page.locator(".opacity-0.translate-y-6")).toHaveCount(0);

  const samples = await page.evaluate(() => {
    const state = window as Window & {
      __scrollHeightSamples?: Array<{ event: string; height: number }>;
    };
    return [
      ...(state.__scrollHeightSamples ?? []),
      { event: "after-scroll", height: document.documentElement.scrollHeight },
    ];
  });
  const heights = samples.map((sample) => sample.height);
  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);

  expect(samples.some((sample) => sample.event === "load")).toBe(true);
  expect(samples.some((sample) => sample.event === "after-hydration")).toBe(true);
  expect((maxHeight - minHeight) / maxHeight).toBeLessThanOrEqual(0.05);
});

test("anchor navigation leaves section headings below the navbar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  await page.getByRole("button", { name: "Projects", exact: true }).click();
  const { navBottom, sectionTop } = await page.evaluate(() => ({
    navBottom: document.querySelector("nav")?.getBoundingClientRect().bottom ?? 0,
    sectionTop: document.getElementById("projects")?.getBoundingClientRect().top ?? 0,
  }));
  expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 1);

  const headingTop = await page
    .getByRole("heading", { level: 2, name: "Selected Works" })
    .evaluate((heading) => heading.getBoundingClientRect().top);
  expect(headingTop).toBeGreaterThan(navBottom);
});

test("persists theme across reload", async ({ page }) => {
  await page.goto("/");

  const themeTrigger = page.getByRole("button", { name: /select theme/i });
  await expect(themeTrigger).toHaveAttribute("aria-expanded", "false");
  await themeTrigger.click();
  await expect(themeTrigger).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("menuitem", { name: /dark/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("theme-mode"))).toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("hero contact dialog opens, reveals the phone on request and returns focus", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const trigger = page.locator("#home").getByRole("button", { name: "Contact" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Let's talk" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /telegram/i })).toHaveAttribute("href", "https://t.me/Akbar02Work");
  await expect(dialog).not.toContainText("964");

  await dialog.getByRole("button", { name: "Show and copy phone number" }).click();
  await expect(dialog).toContainText("+998 90 964 67 69");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("+998909646769");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("contact dialog becomes a bottom sheet on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.locator("#home").getByRole("button", { name: "Contact" }).click();
  const dialog = page.getByRole("dialog", { name: "Let's talk" });
  await expect(dialog).toBeVisible();

  // Poll so the slide-in animation can settle before measuring.
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      return box ? [Math.round(box.y + box.height), Math.round(box.width)] : null;
    })
    .toEqual([844, 390]);
});

test("navbar contact opens the dialog on any page and returns focus to the navbar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  for (const path of ["/", "/projects/voicenotes"]) {
    await page.goto(path);
    const navContact = page.locator("nav").getByRole("button", { name: "Contact", exact: true });
    await navContact.click();

    const dialog = page.getByRole("dialog", { name: "Let's talk" });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/$" : path}`));

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(navContact).toBeFocused();
  }
});

test("mobile menu contact closes the menu and opens the dialog", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/voicenotes");

  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Contact", exact: true }).click();

  await expect(menu).toHaveCount(0);
  const dialog = page.getByRole("dialog", { name: "Let's talk" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /telegram/i })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});
