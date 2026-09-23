import { afterEach, describe, expect, it, vi } from "vitest";
import { storage } from "../storage";

afterEach(() => vi.restoreAllMocks());

describe.each(["local", "session"] as const)("%s storage", (area) => {
  const property = area === "local" ? "localStorage" : "sessionStorage";

  it("survives a denied storage getter", () => {
    vi.spyOn(window, property, "get").mockImplementation(() => {
      throw new DOMException("Storage denied", "SecurityError");
    });
    expect(storage.getString("theme-mode", "system", { area })).toBe("system");
    expect(storage.setString("theme-mode", "dark", { area })).toBe(false);
  });

  it("survives read and write failures", () => {
    const target: Storage = {
      length: 0,
      clear() {},
      key() { return null; },
      removeItem() {},
      getItem() { throw new Error("denied"); },
      setItem() { throw new Error("quota"); },
    };
    vi.spyOn(window, property, "get").mockReturnValue(target);
    expect(storage.getString("theme-mode", "system", { area })).toBe("system");
    expect(storage.setString("theme-mode", "dark", { area })).toBe(false);
  });
});
