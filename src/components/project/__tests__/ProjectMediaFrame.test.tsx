import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectMediaFrame from "../ProjectMediaFrame";
import { fallbackProjectStyle } from "@/constants/projectStyles";

describe("ProjectMediaFrame image fallback", () => {
  it("removes responsive candidates when the phone frame falls back to PNG", () => {
    const { container } = render(
      <ProjectMediaFrame image="/screen.webp" alt="Product" style={fallbackProjectStyle} />
    );
    const frame = container.querySelector('img[aria-hidden="true"]')!;
    expect(frame.getAttribute("srcset")).toContain("512w");
    fireEvent.error(frame);
    expect(frame.hasAttribute("srcset")).toBe(false);
    expect(frame.getAttribute("src")).toBe("/mockups/android-phone-frame.png");
  });

  it("falls back to the declared image when an optional optimized source is absent", () => {
    const { container, rerender } = render(
      <ProjectMediaFrame image="/screen.webp" alt="Product" style={fallbackProjectStyle} mockup={false} />
    );
    fireEvent.error(screen.getByRole("img", { name: "Product" }));
    expect(container.querySelectorAll("source")).toHaveLength(0);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/screen.webp");
    rerender(<ProjectMediaFrame image="/next.png" alt="Next" style={fallbackProjectStyle} mockup={false} />);
    expect(container.querySelectorAll("source")).toHaveLength(2);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/next.png");
  });
});
