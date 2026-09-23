import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`reuses the responsive portrait preload at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const requests: string[] = [];
    page.on("requestfinished", request => {
      if (/\/avatar(?:-\d+)?\.(webp|png)$/.test(request.url())) requests.push(request.url());
    });
    await page.goto("/");
    const portrait = page.getByRole("img", { name: "Akbar Azizov", exact: true });
    await expect.poll(() => portrait.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    const currentSrc = await portrait.evaluate(image => image.currentSrc);
    expect([...new Set(requests)]).toEqual([currentSrc]);
    // WebKit reports an additional memory-cache request event for the same preload.
    const transferred = await page.evaluate(() => performance.getEntriesByType("resource")
      .filter(entry => /\/avatar(?:-\d+)?\.(webp|png)$/.test(entry.name) && (entry as PerformanceResourceTiming).transferSize > 0));
    expect(transferred).toHaveLength(1);
    await expect(portrait).toHaveAttribute("loading", "eager");
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(1);
    const frame = page.locator('img[src*="android-phone-frame"]').first();
    await frame.scrollIntoViewIfNeeded();
    await expect.poll(() => frame.evaluate(image => image.complete && image.currentSrc.endsWith("android-phone-frame-512.webp"))).toBe(true);
  });
}

test("preloads only the project's actual cover and retains cache safety for HTML", async ({ page, request }) => {
  const requests: string[] = [];
  page.on("request", req => {
    if (req.url().includes("screen-01.avif")) requests.push(req.url());
  });
  await page.goto("/projects/voicenotes");
  const cover = page.getByRole("button", { name: "Show screen 1", exact: true }).locator("img");
  await expect.poll(() => cover.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  const currentSrc = await cover.evaluate(image => image.currentSrc);
  expect([...new Set(requests)]).toEqual([currentSrc]);
  const coverTransfers = await page.evaluate(url => performance.getEntriesByName(url)
    .filter(entry => (entry as PerformanceResourceTiming).transferSize > 0).length, currentSrc);
  expect(coverTransfers).toBe(1);
  await expect(cover).toHaveAttribute("loading", "eager");
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute("href", new URL(currentSrc).pathname);
  for (const url of ["/", "/creative/", "/projects/voicenotes", "/projects/voicenotes/index.html"]) {
    expect((await request.get(url)).headers()["cache-control"] ?? "").not.toMatch(/max-age=[1-9]|immutable/);
  }
  for (const url of ["/avatar.webp", "/projects/voicenotes/screen-01.avif", "/mockups/android-phone-frame-512.webp", "/creative/fonts/syne-latin.woff2"]) {
    expect((await request.get(url)).headers()["cache-control"]).toBe("public, max-age=86400");
  }
  for (const font of await page.locator('link[rel="preload"][as="font"]').evaluateAll(links => links.map(link => link.getAttribute("href")!))) {
    expect((await request.get(font)).headers()["cache-control"]).toBe("public, max-age=86400");
  }
});

test("preserves the Creative pointer trail without rendering an empty trail before input", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "WebGL call-count regression is measured in the Chromium lab.");
  await page.addInitScript(() => {
    const counts = { trail: 0, display: 0, attributes: 0 };
    Object.assign(window, { __glCounts: counts });
    const proto = WebGLRenderingContext.prototype;
    const bind = proto.bindFramebuffer;
    const draw = proto.drawArrays;
    const attribute = proto.getAttribLocation;
    let offscreen = false;
    proto.bindFramebuffer = function (target, framebuffer) {
      offscreen = framebuffer !== null;
      return bind.call(this, target, framebuffer);
    };
    proto.drawArrays = function (...args) {
      counts[offscreen ? "trail" : "display"]++;
      return draw.apply(this, args);
    };
    proto.getAttribLocation = function (...args) {
      counts.attributes++;
      return attribute.apply(this, args);
    };
  });
  await page.goto("/creative/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  const counts = () => page.evaluate(() => (window as unknown as { __glCounts: { display: number; trail: number; attributes: number } }).__glCounts);
  await expect.poll(async () => (await counts()).display).toBeGreaterThan(3);
  expect((await counts()).trail).toBe(0);
  expect((await counts()).attributes).toBe(2);
  await page.mouse.move(500, 300);
  await expect.poll(async () => (await counts()).trail).toBeGreaterThan(3);
  expect((await counts()).attributes).toBe(2);
  await page.getByRole("button", { name: "Go to Contact", exact: true }).click();
  await expect(page.locator('.scroll-nav__btn[data-sec="contact"]')).toHaveAttribute("aria-current", "location");
  await expect.poll(() => page.locator(".scroll-nav__fill").evaluate(element => getComputedStyle(element).transform)).not.toBe("matrix(1, 0, 0, 0, 0, 0)");
});
