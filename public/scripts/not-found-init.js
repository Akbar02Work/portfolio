(function () {
  // Vercel serves this same 404 document at the originally requested URL.
  if (!/^\/ru(?:\/|$)/.test(window.location.pathname)) return;

  document.documentElement.lang = "ru";
  document.querySelectorAll("[data-ru]").forEach(function (element) {
    element.textContent = element.getAttribute("data-ru");
  });
  document.querySelector("[data-home-link]").setAttribute("href", "/ru");
})();
