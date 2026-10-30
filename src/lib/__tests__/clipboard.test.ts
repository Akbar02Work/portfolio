import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyText } from "../clipboard";

const writeText = vi.fn<(text: string) => Promise<void>>();
const execCommand = vi.fn<(command: string) => boolean>();
const originalExecCommand = Object.getOwnPropertyDescriptor(document, "execCommand");

describe("copyText", () => {
  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    execCommand.mockReset().mockReturnValue(true);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });
  });

  afterEach(() => {
    document.body.replaceChildren();
    document.getSelection()?.removeAllRanges();
    if (originalExecCommand) Object.defineProperty(document, "execCommand", originalExecCommand);
    else Reflect.deleteProperty(document, "execCommand");
  });

  it("uses the modern API when available", async () => {
    await expect(copyText("email@example.com")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("email@example.com");
    expect(execCommand).not.toHaveBeenCalled();
  });

  it("copies without the modern API and restores focus and selection", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    const button = document.createElement("button");
    const text = document.createTextNode("Keep this selection");
    document.body.append(button, text);
    button.focus();
    const range = document.createRange();
    range.selectNodeContents(text);
    document.getSelection()?.addRange(range);
    execCommand.mockImplementation(() => {
      const input = document.activeElement as HTMLTextAreaElement;
      expect(input.value).toBe("+998909646769");
      expect(input.readOnly).toBe(true);
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(input.value.length);
      return true;
    });

    await expect(copyText("+998909646769")).resolves.toBe(true);
    expect(document.activeElement).toBe(button);
    expect(document.getSelection()?.toString()).toBe("Keep this selection");
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("falls back when the async API rejects", async () => {
    writeText.mockRejectedValueOnce(new DOMException("Denied", "NotAllowedError"));
    await expect(copyText("email@example.com")).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it.each([false, "throws"])("reports failure and removes its input when fallback returns %s", async (result) => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    execCommand.mockImplementation(() => {
      if (result === "throws") throw new Error("Copy denied");
      return false;
    });
    await expect(copyText("email@example.com")).resolves.toBe(false);
    expect(document.querySelector("textarea")).toBeNull();
  });
});
