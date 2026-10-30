const copyWithSelection = (text: string): boolean => {
  if (typeof document.execCommand !== "function") return false;

  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];
  const input = document.createElement("textarea");
  input.value = text;
  input.readOnly = true;
  input.tabIndex = -1;
  input.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;";

  // Stay inside Radix's focus trap when copying from a modal.
  const container = activeElement?.closest('[role="dialog"], [role="alertdialog"]') ?? document.body;
  container.append(input);
  try {
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    activeElement?.focus({ preventScroll: true });
    input.remove();
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach((range) => selection.addRange(range));
    }
  }
};

/** Async Clipboard on HTTPS, selection-based copying for local HTTP previews. */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator.clipboard?.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // A browser may also deny the async API; try copying within this gesture.
  }
  return copyWithSelection(text);
};
