import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { About } from "../About";

describe("About", () => {
  afterEach(cleanup);

  it("shows experience and education instead of project counters", () => {
    render(<About />);

    const experience = screen.getByRole("heading", { level: 3, name: "Experience" }).parentElement!;
    const marketR = within(experience)
      .getAllByRole("listitem")
      .find((item) => item.textContent?.includes("Market-R"))!;
    expect(marketR.textContent).toContain("Android Engineer · Market-R");
    expect(within(marketR).getByText("NDA").getAttribute("title")).toMatch(/non-disclosure/i);

    const education = screen.getByRole("heading", { level: 3, name: "Education" }).parentElement!;
    const degrees = within(education).getAllByRole("listitem");
    expect(degrees).toHaveLength(2);
    expect(degrees.every((item) => item.textContent?.includes("BSUIR"))).toBe(true);

    expect(screen.queryByText(/shipped project/i)).toBeNull();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(7);
  });
});
