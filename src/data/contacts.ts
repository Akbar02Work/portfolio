export const CONTACT_EMAIL = "Akbar02work@gmail.com";

export const CONTACT_AVAILABILITY = "Open to remote opportunities — Tashkent, UTC+5";

export type ContactLink = {
  id: "telegram" | "linkedin" | "github";
  label: string;
  handle: string;
  href: string;
};

// Order matters: Telegram first — the fastest channel for CIS recruiters.
export const contactLinks: ContactLink[] = [
  { id: "telegram", label: "Telegram", handle: "@Akbar02Work", href: "https://t.me/Akbar02Work" },
  { id: "linkedin", label: "LinkedIn", handle: "in/akbar02work", href: "https://www.linkedin.com/in/akbar02work" },
  { id: "github", label: "GitHub", handle: "Akbar02Work", href: "https://github.com/Akbar02Work" },
];

// Footer pills keep their historical order.
export const footerLinkOrder: ContactLink["id"][] = ["github", "telegram", "linkedin"];

// The number is assembled on demand so it is not a plain string in the
// prerendered HTML or an obvious pattern for simple scrapers.
const PHONE_PARTS = ["+998", "90", "964", "67", "69"] as const;

export const revealPhone = () => ({
  display: PHONE_PARTS.join(" "),
  value: PHONE_PARTS.join(""),
});
