import { describe, expect, it } from "vitest";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";

describe("sanitizeUrl", () => {
  it("allows only https/mailto/tel protocols", () => {
    expect(sanitizeUrl("https://github.com/Akbar02Work")).toBe("https://github.com/Akbar02Work");
    expect(sanitizeUrl("mailto:akbar02work@gmail.com")).toBe("mailto:akbar02work@gmail.com");
    expect(sanitizeUrl("tel:+998901234567")).toBe("tel:+998901234567");
  });

  it("rejects unsafe and malformed URLs", () => {
    expect(sanitizeUrl("http://example.com")).toBeNull();
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(sanitizeUrl("/relative/path")).toBeNull();
    expect(sanitizeUrl("")).toBeNull();
  });
});

describe("isAllowedExternalUrl", () => {
  it("allows configured domains and subdomains", () => {
    expect(isAllowedExternalUrl("https://github.com/Akbar02Work")).toBe(true);
    expect(isAllowedExternalUrl("https://www.linkedin.com/in/akbar02work")).toBe(true);
    expect(isAllowedExternalUrl("https://subdomain.t.me/channel")).toBe(true);
  });

  it("rejects non-https and unknown domains", () => {
    expect(isAllowedExternalUrl("http://github.com/Akbar02Work")).toBe(false);
    expect(isAllowedExternalUrl("https://evil.example.com")).toBe(false);
    expect(isAllowedExternalUrl("mailto:akbar02work@gmail.com")).toBe(false);
    expect(isAllowedExternalUrl("not-a-url")).toBe(false);
  });
});
