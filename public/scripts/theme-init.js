(function () {
  try {
    var root = document.documentElement;
    var stored = window.localStorage && window.localStorage.getItem("theme-mode");
    var mode = stored ? String(stored).replace(/^"(.*)"$/, "$1") : "system";
    var isDark;

    if (mode === "light" || mode === "dark") {
      isDark = mode === "dark";
    } else {
      isDark =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    root.style.backgroundColor = isDark ? "#0A0A0A" : "#FAFAF8";
  } catch {
    // no-op
  }
})();
