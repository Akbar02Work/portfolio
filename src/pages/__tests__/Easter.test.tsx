import { cleanup, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/hooks/useTheme";
import Easter from "@/pages/Easter";

const renderEaster = () =>
  render(
    <ThemeProvider>
      <HelmetProvider>
        <MemoryRouter>
          <Easter />
        </MemoryRouter>
      </HelmetProvider>
    </ThemeProvider>
  );

describe("Easter page", () => {
  afterEach(cleanup);

  it("is the only entry to Creative mode and no longer shows a changelog", () => {
    renderEaster();

    expect(screen.getByRole("heading", { level: 1, name: "Creative mode" })).toBeTruthy();
    const enter = screen.getByRole("link", { name: /enter creative mode/i });
    expect(enter.getAttribute("href")).toMatch(/\/creative\/$|:5174\/$/);
    expect(screen.getByRole("link", { name: /back to the site/i })).toBeTruthy();
    expect(screen.queryByText(/changelog/i)).toBeNull();
  });
});
