import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactDialog } from "../ContactDialog";

const execCommand = vi.fn<(command: string) => boolean>();
const originalExecCommand = Object.getOwnPropertyDescriptor(document, "execCommand");
const writeText = vi.fn<(text: string) => Promise<void>>();

const renderDialog = () => render(<ContactDialog trigger={<button type="button">Contact</button>} />);
const openDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: "Contact" }));
  return screen.getByRole("dialog", { name: "Let's talk" });
};

// Observe whether React allows the native link, then suppress OS navigation in jsdom.
const clickLink = (link: HTMLElement) => {
  let prevented = false;
  document.addEventListener("click", (event) => {
    prevented = event.defaultPrevented;
    event.preventDefault();
  }, { once: true });
  fireEvent.click(link);
  return prevented;
};

const revealAndCopyPhone = async () => {
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Show and copy phone number" })));
};

describe("ContactDialog", () => {
  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    execCommand.mockReset().mockReturnValue(false);
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    if (originalExecCommand) Object.defineProperty(document, "execCommand", originalExecCommand);
    else Reflect.deleteProperty(document, "execCommand");
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

  it("reveals and copies the phone on the first press, then allows calling on the second", async () => {
    renderDialog();
    expect(openDialog().textContent).not.toContain("964");
    await revealAndCopyPhone();
    expect(writeText).toHaveBeenCalledWith("+998909646769");
    expect(screen.getByRole("status").textContent).toContain("Press the number again to open your phone app.");
    const link = screen.getByRole("link", { name: /Phone .* — call/ });
    expect(link.getAttribute("href")).toBe("tel:+998909646769");
    expect(clickLink(link)).toBe(false);
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("copies email first and allows mailto on a second press while confirmation is visible", async () => {
    renderDialog();
    openDialog();
    const link = screen.getByRole("link", { name: /Copy email/ });
    await act(async () => expect(clickLink(link)).toBe(true));
    expect(writeText).toHaveBeenCalledWith("Akbar02work@gmail.com");
    expect(screen.getByText("Email copied to clipboard")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Press the email again to open your email app.");
    expect(link.getAttribute("href")).toBe("mailto:akbar02work@gmail.com");
    expect(clickLink(link)).toBe(false);
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it.each(["denied", "unavailable"])("reports %s copying and lets the user retry", async (failure) => {
    if (failure === "denied") writeText.mockRejectedValueOnce(new DOMException("Clipboard denied", "NotAllowedError"));
    else Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    renderDialog();
    openDialog();
    await revealAndCopyPhone();
    expect(screen.getByRole("alert").textContent).toContain("Couldn't copy the number");
    expect(screen.queryByRole("status")).toBeNull();

    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await act(async () => clickLink(screen.getByRole("link", { name: /Phone .* — copy number/ })));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("Phone number copied to clipboard")).toBeTruthy();
  });

  it("copies in an HTTP preview without Clipboard API and restores modal focus", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    execCommand.mockImplementation(() => {
      const input = document.activeElement as HTMLTextAreaElement;
      expect(input.value).toBe("Akbar02work@gmail.com");
      expect(input.closest('[role="dialog"]')).not.toBeNull();
      return true;
    });
    renderDialog();
    openDialog();
    const link = screen.getByRole("link", { name: /Copy email/ });
    link.focus();
    await act(async () => clickLink(link));
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByText("Email copied to clipboard")).toBeTruthy();
    expect(document.activeElement).toBe(link);
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("keeps email navigation blocked when copying fails", async () => {
    writeText.mockRejectedValueOnce(new DOMException("Clipboard denied", "NotAllowedError"));
    renderDialog();
    openDialog();
    await act(async () => expect(clickLink(screen.getByRole("link", { name: /Copy email/ }))).toBe(true));
    expect(screen.getByRole("alert").textContent).toContain("Couldn't copy the email");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("removes an earlier confirmation when copying another contact fails", async () => {
    renderDialog();
    openDialog();
    await revealAndCopyPhone();
    expect(screen.getByText("Phone number copied to clipboard")).toBeTruthy();
    writeText.mockRejectedValueOnce(new DOMException("Clipboard denied", "NotAllowedError"));
    await act(async () => clickLink(screen.getByRole("link", { name: /Copy email/ })));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.queryByText("Phone number copied to clipboard")).toBeNull();
  });

  it("keeps opening the copied contact after the confirmation expires", async () => {
    vi.useFakeTimers();
    renderDialog();
    openDialog();
    await revealAndCopyPhone();
    expect(screen.getByText("Phone number copied to clipboard")).toBeTruthy();
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.queryByRole("status")).toBeNull();
    expect(clickLink(screen.getByRole("link", { name: /Phone .* — call/ }))).toBe(false);
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("copies social links once and remembers each contact independently", async () => {
    vi.useFakeTimers();
    renderDialog();
    openDialog();
    await act(async () => expect(clickLink(screen.getByRole("link", { name: "Copy Telegram link" }))).toBe(true));
    expect(writeText).toHaveBeenLastCalledWith("https://t.me/Akbar02Work");
    await act(async () => expect(clickLink(screen.getByRole("link", { name: "Copy GitHub link" }))).toBe(true));
    expect(writeText).toHaveBeenLastCalledWith("https://github.com/Akbar02Work");
    act(() => vi.advanceTimersByTime(7000));
    expect(clickLink(screen.getByRole("link", { name: "Open Telegram" }))).toBe(false);
    expect(clickLink(screen.getByRole("link", { name: "Open GitHub" }))).toBe(false);
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("remembers copied contacts when the same dialog is reopened", async () => {
    renderDialog();
    openDialog();
    await revealAndCopyPhone();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    openDialog();
    expect(clickLink(screen.getByRole("link", { name: /Phone .* — call/ }))).toBe(false);
    expect(writeText).toHaveBeenCalledTimes(1);
  });

});
