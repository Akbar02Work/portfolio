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

  it.each(["denied", "unavailable"])("reports %s clipboard access and recovers on retry", async (failure) => {
    if (failure === "denied") {
      writeText.mockRejectedValueOnce(new DOMException("Clipboard denied", "NotAllowedError"));
    } else {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    }
    renderDialog();
    const dialog = openDialog();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show and copy phone number" }));
    });

    expect(screen.getByRole("alert").textContent).toContain("Couldn't copy the number. Select it and copy it manually.");
    expect(dialog.textContent).toContain("+998 90 964 67 69");
    expect(screen.queryByText("Phone number copied to clipboard")).toBeNull();
    expect(dialog.querySelector('[data-active="true"] .lucide-check')).toBeNull();

    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Phone .* — copy number/ }));
    });

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("Phone number copied to clipboard")).toBeTruthy();
  });

  it("removes an earlier success indication when the next copy fails", async () => {
    renderDialog();
    openDialog();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Show and copy phone number" }));
    });
    expect(screen.getByText("Phone number copied to clipboard")).toBeTruthy();

    writeText.mockRejectedValueOnce(new DOMException("Clipboard denied", "NotAllowedError"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Phone .* — copy number/ }));
    });

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.queryByText("Phone number copied to clipboard")).toBeNull();
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
