import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/hooks/useTheme";

const renderNavbar = () => render(
  <ThemeProvider>
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  </ThemeProvider>
);

describe("mobile menu page coverage", () => {
  afterEach(cleanup);

  it("restores the underlying page on close and unmount", async () => {
    const { unmount } = renderNavbar();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog", { name: "Menu" });
    expect(document.documentElement).toHaveAttribute("data-mobile-menu-open");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(document.documentElement).not.toHaveAttribute("data-mobile-menu-open"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.documentElement).toHaveAttribute("data-mobile-menu-open");
    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-mobile-menu-open");
  });

  it("restores the page when handing off to the contact dialog", async () => {
    renderNavbar();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = await screen.findByRole("dialog", { name: "Menu" });
    fireEvent.click(within(menu).getByRole("button", { name: "Contact" }));

    await screen.findByRole("dialog", { name: "Let's talk" });
    expect(document.documentElement).not.toHaveAttribute("data-mobile-menu-open");
    expect(screen.queryByRole("dialog", { name: "Menu" })).toBeNull();
  });
});
