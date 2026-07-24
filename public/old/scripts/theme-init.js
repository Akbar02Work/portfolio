(function () {
  try {
    var stored = window.localStorage && window.localStorage.getItem("theme-mode");
    if (stored === "light" || stored === "dark") {
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    var prefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  } catch {
    // no-op
  }
})();
