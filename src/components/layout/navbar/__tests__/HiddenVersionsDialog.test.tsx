import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { messages } from "@/i18n/messages";

describe("hidden versions", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
    window.localStorage.clear();
  });

  for (const [route, locale] of [["/", "en"], ["/ru", "ru"]] as const) {
    it(`opens the ${locale} chooser on the third click and restores focus after Escape`, async () => {
      window.localStorage.clear();
      window.history.replaceState({}, "", route);
      render(<App />);
      const logo = document.querySelector<HTMLAnchorElement>("nav a")!;
      fireEvent.click(logo);
      fireEvent.click(logo);
      expect(screen.queryByRole("dialog")).toBeNull();
      fireEvent.click(logo);
      const dialog = await screen.findByRole("dialog", { name: messages[locale].hiddenVersions.title });
      const creative = within(dialog).getByRole("link", { name: /^Creative/ });
      expect(within(dialog).getByRole("link", { name: /^Old/ }).getAttribute("href")).toBe("/old/");
      await waitFor(() => expect(document.activeElement).toBe(creative));
      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      expect(document.activeElement).toBe(logo);
    });
  }

  it("replaces the mobile menu with the chooser and returns focus to the main logo", async () => {
    window.localStorage.clear();
    render(<App />);
    const logo = document.querySelector<HTMLAnchorElement>("nav a")!;
    fireEvent.click(screen.getByRole("button", { name: messages.en.nav.openMenu }));
    const menu = await screen.findByRole("dialog", { name: messages.en.nav.menuTitle });
    const menuLogo = menu.querySelector<HTMLAnchorElement>("a")!;
    for (let click = 0; click < 3; click += 1) fireEvent.click(menuLogo);
    const dialog = await screen.findByRole("dialog", { name: messages.en.hiddenVersions.title });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: messages.en.nav.menuTitle })).toBeNull());
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    await waitFor(() => expect(document.activeElement).toBe(within(dialog).getByRole("link", { name: /^Creative/ })));
    fireEvent.click(within(dialog).getByRole("button", { name: messages.en.nav.closeMenu }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(logo);
  });

  it("navigates each choice in the current tab", async () => {
    window.localStorage.clear();
    render(<App />);
    const logo = document.querySelector<HTMLAnchorElement>("nav a")!;
    for (let click = 0; click < 3; click += 1) fireEvent.click(logo);
    const dialog = await screen.findByRole("dialog", { name: messages.en.hiddenVersions.title });
    const assign = vi.fn();
    const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({ ...window.location, assign });
    try {
      for (const name of [/^Creative/, /^Old/]) {
        const link = within(dialog).getByRole("link", { name });
        expect(link.getAttribute("target")).toBe("_self");
        fireEvent.click(link);
        expect(assign).toHaveBeenLastCalledWith(link.getAttribute("href"));
      }
    } finally {
      locationSpy.mockRestore();
    }
  });
});
