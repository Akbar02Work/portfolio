import { describe, expect, it } from "vitest";
import { localeFromPath, localizePath, stripLocale } from "../locales";
import { messages } from "../messages";

describe("locale paths", () => {
  it.each([
    ["/", "en"], ["/projects/voicenotes", "en"], ["/russia", "en"],
    ["/ru", "ru"], ["/ru/", "ru"], ["/ru/projects/voicenotes", "ru"],
  ])("detects %s as %s", (path, locale) => {
    expect(localeFromPath(path)).toBe(locale);
  });

  it("strips and adds the prefix without touching query or hash", () => {
    expect(stripLocale("/ru")).toBe("/");
    expect(stripLocale("/ru/projects/voicenotes?platform=web")).toBe("/projects/voicenotes?platform=web");
    expect(stripLocale("/russia")).toBe("/russia");
    expect(localizePath("/", "ru")).toBe("/ru");
    expect(localizePath("/projects/voicenotes?platform=web#top", "ru")).toBe("/ru/projects/voicenotes?platform=web#top");
    expect(localizePath("/ru/projects/voicenotes", "en")).toBe("/projects/voicenotes");
    expect(localizePath("/ru/projects/voicenotes", "ru")).toBe("/ru/projects/voicenotes");
    expect(localizePath("https://example.com", "ru")).toBe("https://example.com");
  });

  it("keeps both dictionaries structurally identical", () => {
    const shape = (value: unknown): unknown =>
      typeof value === "object" && value !== null
        ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape((value as Record<string, unknown>)[key])]))
        : typeof value;
    expect(shape(messages.ru)).toEqual(shape(messages.en));
  });
});
