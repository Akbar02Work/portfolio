import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectMediaFrame from "../ProjectMediaFrame";
import { fallbackProjectStyle } from "@/constants/projectStyles";

describe("ProjectMediaFrame image fallback", () => {
  it("falls back to the declared image when an optional optimized source is absent", () => {
    const { container, rerender } = render(
      <ProjectMediaFrame image="/screen.webp" alt="Product" style={fallbackProjectStyle} />
    );
    fireEvent.error(screen.getByRole("img", { name: "Product" }));
    expect(container.querySelectorAll("source")).toHaveLength(0);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/screen.webp");
    rerender(<ProjectMediaFrame image="/next.png" alt="Next" style={fallbackProjectStyle} />);
    expect(container.querySelectorAll("source")).toHaveLength(2);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/next.png");
  });
});
