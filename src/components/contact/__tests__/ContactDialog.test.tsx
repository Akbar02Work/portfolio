import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactDialog } from "../ContactDialog";

const writeText = vi.fn<(text: string) => Promise<void>>();

const renderDialog = () =>
  render(<ContactDialog trigger={<button type="button">Contact</button>} />);

const openDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: "Contact" }));
  return screen.getByRole("dialog", { name: "Let's talk" });
};

describe("ContactDialog", () => {
  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("lists every contact channel with safe external links", () => {
    renderDialog();
    const dialog = openDialog();

    const telegram = screen.getByRole("link", { name: /telegram/i });
    expect(telegram.getAttribute("href")).toBe("https://t.me/Akbar02Work");
    expect(telegram.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByRole("link", { name: /linkedin/i }).getAttribute("href")).toBe("https://www.linkedin.com/in/akbar02work");
    expect(screen.getByRole("link", { name: /github/i }).getAttribute("href")).toBe("https://github.com/Akbar02Work");
    expect(dialog.textContent).toContain("Akbar02work@gmail.com");
  });

  it("keeps the phone number hidden until requested, then reveals and copies it", async () => {
    renderDialog();
    const dialog = openDialog();
    expect(dialog.textContent).not.toContain("964");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show and copy phone number" }));
    });

    expect(writeText).toHaveBeenCalledWith("+998909646769");
    expect(dialog.textContent).toContain("+998 90 964 67 69");
    expect(dialog.textContent).toContain("Copied");
  });

  it("copies the email address instead of navigating", async () => {
    renderDialog();
    openDialog();

    await act(async () => {
      fireEvent.click(screen.getByRole("link", { name: /email/i }));
    });

    expect(writeText).toHaveBeenCalledWith("Akbar02work@gmail.com");
    expect(screen.getByText("Email copied to clipboard")).toBeTruthy();
  });

  it("clears the copied state after a short delay", async () => {
    vi.useFakeTimers();
    renderDialog();
    openDialog();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show and copy phone number" }));
    });
    expect(screen.getByText("Phone number copied to clipboard")).toBeTruthy();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryByText("Phone number copied to clipboard")).toBeNull();
  });
});
